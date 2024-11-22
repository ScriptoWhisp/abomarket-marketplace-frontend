<script setup>

import { ref, onMounted } from "vue";
import axios from "axios";

const productImg = 'https://www.diskmat.ee/raamat12.gif'
const products = ref([]);
const currentPage = ref(1);
const pageSize = 10;
const totalPages = ref(1);
const categories = ref([])

const error = ref('');
const activeCategory = ref(null);
const activeSort = ref("productId");
const activeSortDirection = ref("DESC");
const activeSearch = ref(null);

const fetchProducts = async () => {
  try {
    let url = `/api/products?sortBy=${activeSort.value}&sortDirection=${activeSortDirection.value}&pageNo=${currentPage.value - 1}&pageSize=${pageSize}`;

    if (activeCategory.value !== null) {
      url += `&category=${activeCategory.value}`;
    }
    if (activeSearch.value !== null) {
      url += `&name=${activeSearch.value}`;
    }

    const response = await axios.get(url);
    console.log(response);
    products.value = response.data.content.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      imageURL: product.imageUrl
    }));
    totalPages.value = response.data.totalPages;
  } catch (err) {
    error.value = 'Error fetching products: ' + err.message;
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(`/api/categories`);
    console.log(response);
    categories.value = response.data.map(category => ({
      id: category.id,
      name: category.name
    }));
  } catch (err) {
    error.value = 'Error fetching categories: ' + err.message;
  }
};

// for sorting by category
const filterByCategory = (categoryId) => {
  if (activeCategory.value === categoryId) {
    activeCategory.value = null;
  } else {
    activeCategory.value = categoryId;
  }
  fetchProducts()
};

const selectSortOption = (option) => {
  switch (option) {
    case 'new-first':
      activeSort.value = 'productId';
      activeSortDirection.value = 'DESC';
      break;
    case 'old-first':
      activeSort.value = 'productId';
      activeSortDirection.value = 'ASC';
      break;
    case 'lowest-price':
      activeSort.value = 'price';
      activeSortDirection.value = 'ASC';
      break;
    case 'highest-price':
      activeSort.value = 'price';
      activeSortDirection.value = 'DESC';
      break;
  }
  fetchProducts();
};

const handleSearch = () => {
  fetchProducts();
};

const nextPage = () => {
  currentPage.value++;
  fetchProducts();
};

const previousPage = () => {
  currentPage.value--;
  fetchProducts();
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

</script>

<template>
  <div v-if="error" class="error-message">{{ error }}</div>

  <div class="bg-white flex">

    <aside class="w-1/4 min-h-screen bg-white border-r border-gray-300 px-4 py-8">

      <form class="mx-auto flex items-center space-x-2" @submit.prevent="handleSearch">
        <div class="relative flex-1">
          <input
              type="search"
              v-model="activeSearch"
              id="default-search"
              class="block w-full py-2 px-4 text-sm text-black border border-gray-500 rounded bg-gray-100 focus:outline-none focus:ring-0"
              placeholder="Search..."
          />
        </div>
        <button
            type="submit"
            class="flex items-center justify-center py-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700 hover:scale-110"
        >
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 19l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>



      <!-- Sort Section -->
      <h3 class="text-lg font-semibold mb-6">Sort</h3>
      <div class="flex flex-col space-y-4">
        <!-- Sort by New/Old and Price -->
        <button
            @click="selectSortOption('new-first')"
            :class="{'bg-gray-400': activeSort === 'productId' && activeSortDirection === 'DESC', 'bg-gray-200': activeSort !== 'productId' || activeSortDirection !== 'DESC'}"
            class="flex items-center justify-center py-2 px-4 text-black rounded hover:scale-105"
        >
          New products first
        </button>
        <button
            @click="selectSortOption('old-first')"
            :class="{'bg-gray-400': activeSort === 'productId' && activeSortDirection === 'ASC', 'bg-gray-200': activeSort !== 'productIDd' || activeSortDirection !== 'ASC'}"
            class="flex items-center justify-center py-2 px-4 text-black rounded hover:scale-105"
        >
          Old products first
        </button>
        <button
            @click="selectSortOption('lowest-price')"
            :class="{'bg-gray-400': activeSort === 'price' && activeSortDirection === 'ASC', 'bg-gray-200': activeSort !== 'price' || activeSortDirection !== 'ASC'}"
            class="flex items-center justify-center py-2 px-4 text-black rounded hover:scale-105"
        >
          Lowest price first
        </button>
        <button
            @click="selectSortOption('highest-price')"
            :class="{'bg-gray-400': activeSort === 'price'  && activeSortDirection === 'DESC', 'bg-gray-200': activeSort !== 'price' || activeSortDirection !== 'DESC'}"
            class="flex items-center justify-center py-2 px-4 text-black rounded hover:scale-105"
        >
          Highest price first
        </button>
      </div>

      <!-- Categories Section -->
      <h3 class="text-lg font-semibold mt-6 mb-6">Categories</h3>
      <div class="flex flex-col space-y-4">
        <div v-for="category in categories" :key="category.id">
          <button
              @click="filterByCategory(category.id)"
              :class="{
              'bg-gray-400': activeCategory === category.id,
              'bg-gray-200': activeCategory !== category.id
            }"
              class="flex items-center justify-center py-2 px-4 text-black rounded hover:scale-105 w-full text-left"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="text-black text-5xl mb-10">Products</h2>

      <div v-if="products.length === 0 || error" class="text-2xl text-gray-500 text-center">Nothing to show</div>

      <div v-else>
        <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <a v-for="product in products" :key="product.id" :href="'/product/' + product.id" class="group">

            <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <img v-if="product.imageURL" :src="product.imageURL" :alt="productImg" class="h-full w-full object-cover object-center group-hover:opacity-75" />
              <img v-else :src="productImg" :alt="productImg" class="h-full w-full object-cover object-center group-hover:opacity-75" />
            </div>
            <p class="mt-1 text-lg font-medium text-gray-900">{{ product.price }}</p>
            <h3 class="text-sm text-gray-700">{{ product.name }}</h3>
          </a>
        </div>

        <div class="flex flex-col items-center mt-10">
          <!-- Help text -->
          <span class="text-sm text-gray-700">
            <span class="font-semibold text-black">{{ currentPage }}</span> page of <span class="font-semibold text-black">{{ totalPages }}</span>
          </span>
          <!-- Buttons -->
          <div class="inline-flex mt-2 xs:mt-0">
            <button @click="previousPage" :disabled="currentPage === 1" class="flex items-center justify-center px-3 h-16 w-16 lg:h-8 text-sm font-medium text-black bg-gray-50 rounded-s hover:bg-gray-200">
              Prev
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="flex items-center justify-center px-3 h-16 w-16 lg:h-8 text-sm font-medium text-black bg-gray-50 border-0 border-s border-gray-300 rounded-e hover:bg-gray-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>