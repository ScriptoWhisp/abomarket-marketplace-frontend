<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {getUserIdFromToken} from "@/helpers/JWTHelper.js";

const props = defineProps({
  id: String
});

const token = localStorage.getItem('user_token');
const userId = getUserIdFromToken(token);
console.log(userId);

const product = ref({});
const error = ref('');

const createProduct = async () => {
  try {
    const response = await axios.post(`/api/products`, {
      name: product.value.name,
      price: product.value.price,
      description: product.value.description,
      categoryId: product.value.categoryId,
      sellerId: userId,
      imageUrl: product.value.imageURL
    });
    console.log(response);
    console.log('Product created');
    window.location.href = userId + `/products`;
  } catch (err) {
    error.value = 'Error creating products: ' + err.message;
  }
};


</script>

<template>


  <body>
  <div class="w-10/12 m-auto columns-1">
    <h1>creating product</h1>
    <label for="product-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
    <input type="text" id="product-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="product.name">
    <label for="product-price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
    <input type="text" id="product-price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="product.price">
    <label for="product-description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
    <textarea id="product-description" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="product.description"></textarea>
    <label for="product-category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Id</label>
    <input type="text" id="product-category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="product.categoryId">
    <label for="product-image" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image URL</label>
    <input type="text" id="product-image" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" v-model="product.imageURL">
    <button @click="createProduct" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create</button>
  </div>


  </body>
</template>

<style scoped>

</style>