<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {getUserIdFromToken} from "@/helpers/JWTHelper.js";
import {triggerError} from "@/helpers/ErrorHelper.js";

const props = defineProps({
  id: String
});

const token = localStorage.getItem('user_token');
let userId = -1;
console.log(userId);

const product = ref({});
const category = ref("");
const seller = ref({});
let productImg = 'https://www.diskmat.ee/raamat12.gif'
const error = ref({});

const quantity = ref(1);

const fetchProduct = async () => {
  try {
    await axios.get('/api/users/profile')
    userId = getUserIdFromToken(token);
  } catch (err) {
    localStorage.clear();
  }

  try {
    const response = await axios.get(`/api/products/${props.id}`);
    console.log(response);
    product.value = response.data;
    productImg = product.value.imageUrl ? product.value.imageUrl : productImg;

    await fetchCategory();
    await fetchSellerName();
  } catch (err) {
    triggerErrorCustom(err.response.data, 'fetching product');
  }
};

const fetchCategory = async () => {
  try {
    const response = await axios.get(`/api/categories/${product.value.categoryId}`);
    console.log(response);
    category.value = response.data.name;
  } catch (err) {
    triggerErrorCustom(err.response.data, 'fetching category');
  }
};


const fetchSellerName = async () => {
  try {
    const response = await axios.get(`/api/users/${product.value.sellerId}`);
    console.log(response);
    seller.value = response.data;
  } catch (err) {
    triggerErrorCustom(err.response.data, 'fetching seller');
  }
};


const updateProduct = async () => {
  try {
    const response = await axios.patch(`/api/products/${props.id}`, {
      name: product.value.name,
      price: product.value.price,
      description: product.value.description,
      categoryId: product.value.categoryId,
      sellerId: product.value.sellerId,
      imageUrl: productImg
    });
    console.log(response);
    console.log('Product updated');
  } catch (err) {
    triggerErrorCustom(err.response.data, 'updating product');
  }
};


const buyProduct = async () => {
  try {
    const user_data = ref({})
    user_data.value = (await axios.get(`/api/users/${userId}`)).data
    console.log(user_data)
    const response = await axios.post(`/api/order_items`, {
      orderId: user_data.value.unfinishedOrderId,
      productId: product.value.id,
      quantity: quantity.value,
      priceAtTimeOfOrder: product.value.price
    });
    console.log(response);
    console.log('Product added to cart (hopefully)');
  } catch (err) {
    triggerErrorCustom(err.response.data, 'test buying one product');
  }
};

const deleteProduct = async () => {
  try {
    const response = await axios.delete(`/api/products/${props.id}`);
    console.log(response);
    console.log('Product deleted');
    window.location.href = '/';
  } catch (err) {
    triggerErrorCustom(err.response.data, 'deleting product');
  }
};

const triggerErrorCustom = (err, operation) => {
  triggerError('error while ' + operation + ': ' + err.message);
};

onMounted(fetchProduct);
</script>

<template>


  <body>
  <div class="w-10/12 m-auto columns-2" v-if="seller.id != userId">
      <img class="inline h-auto w-1/2" :src="productImg" alt="description">
      <h2 class="text-black text-5xl ml-20 mb-10">{{product.name}}</h2>
      <h3 class="text-black text-4xl ml-20 mb-10">Category: {{category}}</h3>
      <a :href="'/user/' + seller.id + '/products'"><h4 class="text-black text-4xl ml-20 mb-10">Seller: {{seller.firstName}} (click to see other products) </h4></a>
      <h5 class="text-black text-4xl ml-20 mb-10 w-3/12">Price: {{product.price}}</h5>
      <p class="text-black text-2xl ml-20 mb-10">{{product.description}}</p>

    <div class="w-1/12">
      <label for="number-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity:</label>
      <input v-model="quantity"  type="number" id="number-input" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
    </div>
    <button type="button" @click="buyProduct" data-modal-target="static-modal" data-modal-toggle="static-modal" class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
      Add to cart
    </button>
  </div>
  <div class="w-10/12 m-auto columns-2" v-else>
    <h1>Editing product</h1>
    <img class="inline h-auto w-1/2" :src="productImg" alt="description">
    <label for="product-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
    <input type="text" id="product-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="product.name">
    <label for="product-price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
    <input type="text" id="product-price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="product.price">
    <label for="product-description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
    <textarea id="product-description" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="product.description"></textarea>
    <label for="product-category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Id</label>
    <input type="text" id="product-category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="product.categoryId">
    <label for="product-image" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image URL</label>
    <input type="text" id="product-image" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="productImg">
    <button @click="updateProduct" type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Save</button>
    <!-- Delete product -->
    <button type="button" @click="deleteProduct" data-modal-target="static-modal" data-modal-toggle="static-modal" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
      Delete
    </button>

    <!-- Remove later as it's not logical that seller can just buy their own product lol -->
    <div class="w-1/12">
      <label for="number-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity:</label>
      <input v-model="quantity"  type="number" id="number-input" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
    </div>
    <button type="button" @click="buyProduct" data-modal-target="static-modal" data-modal-toggle="static-modal" class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
      Add to cart
    </button>
  </div>
  </body>
</template>

<style scoped>

</style>