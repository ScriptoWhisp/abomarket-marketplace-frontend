<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {getUserIdFromToken} from "@/helpers/JWTHelper.js";
import UserProfileSide from "@/components/UserProfileSide.vue";
import ErrorAlert from "@/components/ErrorAlert.vue";

const props = defineProps({
  id: String
});

const token = localStorage.getItem('user_token');
const userId = getUserIdFromToken(token);
console.log(userId);

const product = ref({});
const errorObj = ref({});

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
    errorObj.value = err.response.data;
  }
};


</script>

<template>

  <body>
  <div class="flex justify-left h-dvh">
    <UserProfileSide />
    <div class="bg-white w-3/4 lg:w-1/2 p-5">
      <h2 class="text-4xl font-semibold text-gray-900 mb-10">Creating product</h2>
      <label for="product-name" class="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
      <input type="text" id="product-name" class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" v-model="product.name">
      <label for="product-price" class="block mb-2 text-sm font-medium text-gray-900 ">Price</label>
      <input type="text" id="product-price" class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" v-model="product.price">
      <label for="product-description" class="block mb-2 text-sm font-medium text-gray-900 ">Description</label>
      <textarea id="product-description" class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" v-model="product.description"></textarea>
      <label for="product-category" class="block mb-2 text-sm font-medium text-gray-900 ">Category Id</label>
      <input type="text" id="product-category" class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" v-model="product.categoryId">
      <label for="product-image" class="block mb-2 text-sm font-medium text-gray-900 ">Image URL</label>
      <input type="text" id="product-image" class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" v-model="product.imageURL">
      <button @click="createProduct" class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create</button>
      <ErrorAlert class="mt-5" v-if="errorObj.message" :message="errorObj.message"/>
    </div>
    <div class="bg-white w-1/4"></div>
  </div>
  </body>
</template>

<style scoped>

</style>