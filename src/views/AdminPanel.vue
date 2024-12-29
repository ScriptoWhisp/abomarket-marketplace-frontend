<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import { triggerError } from "@/helpers/ErrorHelper.js"
import { getIsAdminFromToken } from "@/helpers/JWTHelper.js"
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from "@headlessui/vue"
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline"

const selectedCategory = ref("users")
const objects = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const activeSearch = ref(null)
const pageSize = 10

const openDelete = ref(false)
const openManage = ref(false)
const openCreate = ref(false)

const editItemId = ref(null)
const editData = ref({})

const orderItems = ref([])
const orderItemsCurrentPage = ref(1)
const orderItemsTotalPages = ref(1)
const orderItemsPageSize = 1

const categoryFields = {
  users: [
    { name: "firstName", label: "First name", type: "text" },
    { name: "lastName", label: "Last name", type: "text" },
    { name: "email", label: "Email address", type: "email" },
    { name: "phone", label: "Phone number", type: "text" },
    { name: "location", label: "Location", type: "text" },
  ],
  orders: [
    { name: "statusId", label: "Status Id", type: "text" },
    { name: "userId", label: "User Id", type: "text"}
  ],
  orderItems: [
    { name: "productId", label: "Product ID", type: "number" },
    { name: "quantity", label: "Quantity", type: "number" },
    { name: "priceAtTimeOfOrder", label: "Price", type: "number" },
  ],
  products: [
    { name: "name", label: "Product Name", type: "text" },
    { name: "price", label: "Price", type: "number" },
    { name: "description", label: "Description", type: "text" },
    { name: "imageUrl", label: "Image URL", type: "text" },
    { name: "categoryId", label: "Category ID", type: "number" },
    { name: "sellerId", label: "Seller ID", type: "number" },
  ],
  statuses: [
    { name: "name", label: "Status Name", type: "text" }
  ],
  categories: [
    { name: "name", label: "Category Name", type: "text" },
  ]
}

const router = useRouter()

const fetchUsers = async (searchTerm = "", page = 1) => {
  try {
    let url = `/api/users?pageNo=${page - 1}&pageSize=${pageSize}`
    if (searchTerm) {
      url += `&search=${searchTerm}`
    }
    const response = await axios.get(url)
    objects.value = response.data.content.map(user => ({
      id: user.id,
      data: user.email || "",
    }))
    totalPages.value = response.data.totalPages ?? 1
  } catch (err) {
    triggerError("Error fetching users: " + err.message)
  }
}

const fetchCategories = async (searchTerm = "", page = 1) => {
  try {
    let url = `/api/categories?pageNo=${page - 1}&pageSize=${pageSize}`
    if (searchTerm) {
      url += `&search=${searchTerm}`
    }
    const response = await axios.get(url)
    objects.value = response.data.content.map(category => ({
      id: category.id,
      data: category.name || "",
    }))
    totalPages.value = response.data.totalPages ?? 1
  } catch (err) {
    triggerError("Error fetching categories: " + err.message)
  }
}

const fetchOrders = async (searchTerm = "", page = 1) => {
  try {
    let url = `/api/orders?pageNo=${page - 1}&pageSize=${pageSize}`
    if (searchTerm) {
      url += `&search=${searchTerm}`
    }
    const response = await axios.get(url)
    objects.value = response.data.content.map(order => ({
      id: order.id,
      data: "Order #" + order.id,
    }))
    totalPages.value = response.data.totalPages ?? 1
  } catch (err) {
    triggerError("Error fetching orders: " + err.message)
  }
}

const fetchProducts = async (searchTerm = "", page = 1) => {
  if (isNaN(searchTerm)) {
    searchTerm = ""
  }
  try {
    let url = `/api/products?pageNo=${page - 1}&pageSize=${pageSize}`
    if (searchTerm) {
      url += `&productId=${searchTerm}`
    }
    const response = await axios.get(url)
    objects.value = response.data.content.map(product => ({
      id: product.id,
      data: "#" + product.id + " " + product.name || "",
    }))
    totalPages.value = response.data.totalPages ?? 1
  } catch (err) {
    triggerError("Error fetching products: " + err.message)
  }
}

const fetchStatuses = async (searchTerm = "", page = 1) => {
  try {
    let url = `/api/statuses?pageNo=${page - 1}&pageSize=${pageSize}`
    if (searchTerm) {
      url += `&search=${searchTerm}`
    }
    const response = await axios.get(url)
    objects.value = response.data.content.map(status => ({
      id: status.id,
      data: status.name || "",
    }))
    totalPages.value = response.data.totalPages ?? 1
  } catch (err) {
    triggerError("Error fetching statuses: " + err.message)
  }
}

const fetchOrderItems = async (page = 1) => {
  orderItemsCurrentPage.value = page
  try {
    const url = `/api/order_items?orderId=${editItemId.value}&pageNo=${page - 1}&pageSize=${orderItemsPageSize}`
    const response = await axios.get(url)
    orderItems.value = response.data.content
    orderItemsTotalPages.value = response.data.totalPages ?? 1
  } catch (err) {
    triggerError("Error fetching order items: " + err.message)
  }
}

onMounted(() => {
  if (!getIsAdminFromToken(localStorage.getItem("user_token"))) {
    triggerError("You are not authorized to view this page")
    router.push("/")
  }
  fetchUsers()
})

const selectCategory = (categoryValue) => {
  selectedCategory.value = categoryValue
  currentPage.value = 1
  handleSearch()
}

const handleSearch = async () => {
  switch (selectedCategory.value) {
    case "users":
      await fetchUsers(activeSearch.value, currentPage.value)
      break
    case "orders":
      await fetchOrders(activeSearch.value, currentPage.value)
      break
    case "products":
      await fetchProducts(activeSearch.value, currentPage.value)
      break
    case "statuses":
      await fetchStatuses(activeSearch.value, currentPage.value)
      break
    case "categories":
      await fetchCategories(activeSearch.value, currentPage.value)
      break
  }
}

const deleteItem = async (objId) => {
  try {
    await axios.delete(`/api/${selectedCategory.value}/${objId}`)
    objects.value = objects.value.filter(o => o.id !== objId)
  } catch (err) {
    triggerError("Error deleting item: " + err.message)
  }
  openDelete.value = false
  handleSearch()
}

const openManageDialog = async (obj) => {
  editItemId.value = obj.id
  try {
    const detailRes = await axios.get(`/api/${selectedCategory.value}/${obj.id}`)
    editData.value = detailRes.data
    if (selectedCategory.value === "orders") {
      await fetchOrderItems(1)
    } else {
      orderItems.value = []
      orderItemsCurrentPage.value = 1
      orderItemsTotalPages.value = 1
    }
  } catch (err) {
    triggerError("Error fetching item details: " + err.message)
    return
  }
  openManage.value = true
}

const openDeleteDialog = async (obj) => {
  editItemId.value = obj.id
  openDelete.value = true
}

const updateItem = async () => {
  try {
    if (selectedCategory.value === "orders") {
      await axios.patch(`/api/orders/${editItemId.value}`, editData.value)
    } else {
      await axios.patch(`/api/${selectedCategory.value}/${editItemId.value}`, editData.value)
    }
    openManage.value = false
    await handleSearch()
  } catch (err) {
    triggerError("Error updating item: " + err.message)
  }
}

const createItem = async () => {
  try {
    console.log(editData.value)
    console.log(`/api/${selectedCategory.value}`)
    await axios.post(`/api/${selectedCategory.value}`, editData.value)
    openCreate.value = false
    await handleSearch()
  } catch (err) {
    triggerError("Error updating item: " + err.message)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    handleSearch()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    handleSearch()
  }
}

const nextOrderItemsPage = () => {
  if (orderItemsCurrentPage.value < orderItemsTotalPages.value) {
    fetchOrderItems(orderItemsCurrentPage.value + 1)
  }
}

const prevOrderItemsPage = () => {
  if (orderItemsCurrentPage.value > 1) {
    fetchOrderItems(orderItemsCurrentPage.value - 1)
  }
}
</script>

<template>
  <div class="bg-white min-h-dvh px-5 sm:px-20">
    <div class="grid lg:grid-cols-7 grid-cols-1 gap-3 p-10 justify-center">
      <button
          @click="selectCategory('users')"
          :class="{ 'bg-blue-200': selectedCategory === 'users', 'bg-gray-100': selectedCategory !== 'users' }"
          class="group hover:bg-gray-200 rounded-lg"
      >
        <p class="text-sm/6 font-semibold text-gray-900 m-3">Users</p>
      </button>
      <button
          @click="selectCategory('orders')"
          :class="{ 'bg-blue-200': selectedCategory === 'orders', 'bg-gray-100': selectedCategory !== 'orders' }"
          class="group hover:bg-gray-200 rounded-lg"
      >
        <p class="text-sm/6 font-semibold text-gray-900 m-3">Orders</p>
      </button>
      <button
          @click="selectCategory('products')"
          :class="{ 'bg-blue-200': selectedCategory === 'products', 'bg-gray-100': selectedCategory !== 'products' }"
          class="group hover:bg-gray-200 rounded-lg"
      >
        <p class="text-sm/6 font-semibold text-gray-900 m-3">Products</p>
      </button>
      <button
          @click="selectCategory('statuses')"
          :class="{ 'bg-blue-200': selectedCategory === 'statuses', 'bg-gray-100': selectedCategory !== 'statuses' }"
          class="group hover:bg-gray-200 rounded-lg"
      >
        <p class="text-sm/6 font-semibold text-gray-900 m-3">Statuses</p>
      </button>
      <button
          @click="selectCategory('categories')"
          :class="{ 'bg-blue-200': selectedCategory === 'categories', 'bg-gray-100': selectedCategory !== 'categories' }"
          class="group hover:bg-gray-200 rounded-lg"
      >
        <p class="text-sm/6 font-semibold text-gray-900 m-3">Categories</p>
      </button>

      <form
          class="flex items-center space-x-2 col-span-1 lg:col-span-2"
          @submit.prevent="handleSearch"
      >
        <div class="relative flex-1">
          <input
              type="search"
              v-model="activeSearch"
              class="block w-full py-2 px-4 text-sm text-black border border-gray-500 rounded bg-gray-100 focus:outline-none focus:ring-0"
              placeholder="Search..."
          />
        </div>
        <button
            type="submit"
            class="flex items-center justify-center py-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700 hover:scale-110"
        >
          <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
              stroke-width="2"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 19l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>
    </div>

    <div  class="px-10"></div>

    <div class="grid grid-cols-1 gap-y-3 p-10">
      <TransitionRoot :show="openCreate" as="div">
        <Dialog class="relative z-10 text-black" @close="openCreate = false">
          <TransitionChild
              as="div"
              enter="ease-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in duration-200"
              leave-from="opacity-100"
              leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-gray-500/75 transition-opacity"></div>
          </TransitionChild>

          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                  as="div"
                  enter="ease-out duration-300"
                  enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enter-to="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leave-from="opacity-100 translate-y-0 sm:scale-100"
                  leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel
                    class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all
                       sm:my-8 sm:w-full sm:max-w-2xl"
                >
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start w-full">
                      <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <DialogTitle as="h3" class="text-xl font-semibold text-gray-900">
                          Create {{ selectedCategory }}
                        </DialogTitle>

                        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                          <div
                              v-for="(field, idx) in categoryFields[selectedCategory]"
                              :key="idx"
                              class="sm:col-span-1"
                          >
                            <label :for="field.name" class="block text-sm font-medium text-gray-900">
                              {{ field.label }}
                            </label>
                            <div class="mt-2">
                              <input
                                  :id="field.name"
                                  v-model="editData[field.name]"
                                  :type="field.type"
                                  class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset
                                     ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                        type="button"
                        class="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm
                           sm:ml-3 sm:w-auto"
                        @click="createItem"
                    >
                      Create
                    </button>
                    <button
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1
                           ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        @click="openCreate = false"
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
      <button
          v-if="selectedCategory === 'categories' || selectedCategory === 'statuses'"
          @click="openCreate = true"
          class="py-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Add
      </button>
      <div v-for="obj in objects" :key="obj.id" class="group bg-gray-100 rounded-lg">
        <div class="flex min-w-0 min-h-12 gap-y-4 m-2">
          <div class="min-w-0 flex-auto">
            <p class="text-sm/6 font-semibold text-gray-900 m-5">
              {{ obj.data }}
            </p>
          </div>
          <div class="flex min-w-0 min-h-12 gap-y-4 m-2 gap-2">
            <button class="group hover:bg-gray-200 rounded-lg" @click="openManageDialog(obj)">
              <p class="text-sm/6 font-semibold text-gray-900 m-3 mx-6">Manage</p>
            </button>
            <button
                class="group text-gray-900 hover:text-white hover:bg-red-500 border-2 border-red-500 rounded-lg"
                @click="openDeleteDialog(obj)"
            >
              <p class="text-sm/6 font-semibold m-3 mx-6">Delete</p>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog for Deletion -->
    <TransitionRoot :show="openDelete" as="div">
      <Dialog class="relative z-10" @close="openDelete = false">
        <TransitionChild
            as="div"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500/75 transition-opacity"></div>
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
                as="div"
                enter="ease-out duration-300"
                enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leave-from="opacity-100 translate-y-0 sm:scale-100"
                leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                  class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                      <ExclamationTriangleIcon class="size-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle as="h3" class="text-base font-semibold text-gray-900">
                        Delete item?
                      </DialogTitle>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">
                          Are you sure you want to delete this item?
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                      type="button"
                      class="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      @click="deleteItem(editItemId)"
                  >
                    Delete
                  </button>
                  <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                           hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      @click="openDelete = false"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Dialog for Manage -->
    <TransitionRoot :show="openManage" as="div">
      <Dialog class="relative z-10 text-black" @close="openManage = false">
        <TransitionChild
            as="div"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500/75 transition-opacity"></div>
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
                as="div"
                enter="ease-out duration-300"
                enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leave-from="opacity-100 translate-y-0 sm:scale-100"
                leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                  class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all
                       sm:my-8 sm:w-full sm:max-w-2xl"
              >
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start w-full">
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <DialogTitle as="h3" class="text-xl font-semibold text-gray-900">
                        Manage {{ selectedCategory }}
                      </DialogTitle>

                      <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        <div
                            v-for="(field, idx) in categoryFields[selectedCategory]"
                            :key="idx"
                            class="sm:col-span-1"
                        >
                          <label :for="field.name" class="block text-sm font-medium text-gray-900">
                            {{ field.label }}
                          </label>
                          <div class="mt-2">
                            <input
                                :id="field.name"
                                v-model="editData[field.name]"
                                :type="field.type"
                                class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset
                                     ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div v-if="selectedCategory === 'orders'" class="mt-8">
                        <h3 class="text-lg font-medium text-gray-900 mb-2">
                          Order Items
                        </h3>

                        <div class="space-y-2">
                          <div
                              v-for="(item, idx) in orderItems"
                              :key="item.id"
                              class="border border-gray-200 p-3 rounded"
                          >
                            <p class="text-sm font-semibold mb-2">Item #{{ idx + 1 }}</p>
                            <div>
                              Product ID: {{ item.productId }}
                            </div>
                            <div>
                              Quantity: {{ item.quantity }}
                            </div>
                            <div>
                              Price: {{ item.priceAtTimeOfOrder }}
                            </div>
                          </div>
                        </div>

                        <div class="flex items-center justify-between mt-4">
                          <button
                              @click="prevOrderItemsPage"
                              :disabled="orderItemsCurrentPage === 1"
                              class="px-3 py-1 bg-gray-200 rounded disabled:bg-gray-100"
                          >
                            Prev
                          </button>
                          <span class="mx-2">
                            {{ orderItemsCurrentPage }} / {{ orderItemsTotalPages }}
                          </span>
                          <button
                              @click="nextOrderItemsPage"
                              :disabled="orderItemsCurrentPage === orderItemsTotalPages"
                              class="px-3 py-1 bg-gray-200 rounded disabled:bg-gray-100"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                      type="button"
                      class="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm
                           sm:ml-3 sm:w-auto"
                      @click="updateItem"
                  >
                    Update
                  </button>
                  <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1
                           ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      @click="openManage = false"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="flex flex-col items-center mt-10">
      <span class="text-sm text-gray-700">
        <span class="font-semibold text-black">{{ currentPage }}</span>
        page of
        <span class="font-semibold text-black">{{ totalPages }}</span>
      </span>
      <div class="inline-flex mt-2 xs:mt-0">
        <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="flex items-center justify-center px-3 h-16 w-16 lg:h-8 text-sm font-medium text-black bg-gray-50 rounded-s hover:bg-gray-200"
        >
          Prev
        </button>
        <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex items-center justify-center px-3 h-16 w-16 lg:h-8 text-sm font-medium text-black bg-gray-50 border-0
                 border-s border-gray-300 rounded-e hover:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
