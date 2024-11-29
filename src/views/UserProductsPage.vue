<script setup>

import { ref, onMounted } from "vue";
import axios from "axios";
import { getUserIdFromToken } from "@/helpers/JWTHelper";
import {triggerError} from "@/helpers/ErrorHelper.js";

const props = defineProps({
  id: String
});

const token = localStorage.getItem('user_token');
const userId = getUserIdFromToken(token);
console.log(userId);


const productImg = 'https://www.diskmat.ee/raamat12.gif'
const products = ref([]);
const currentPage = ref(1);
const pageSize = 4;
const totalPages = ref(1);


const fetchProducts = async () => {
  try {
    const response = await axios.get(`/api/products/user/${props.id}?pageNo=${currentPage.value - 1}&pageSize=${pageSize}`);
    console.log(response);
    products.value = response.data.content.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      imageURL: product.imageUrl
    }));
    totalPages.value = response.data.totalPages;
  } catch (err) {
    triggerError('Error fetching products: ' + err.message);
  }
};


const nextPage = () => {
  currentPage.value++;
  fetchProducts();
};

const previousPage = () => {
  currentPage.value--;
  fetchProducts();
};

onMounted(fetchProducts);

</script>

<template>

  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">


      <h2 class="text-black text-5xl">Products</h2>

      <!-- filter stuff goes here -->

      <!-- and here it ends -->

      <div v-if="userId == props.id" class="flex justify-start">
        <router-link to="/user" class="text-black text-left hover:underline">Back to profile</router-link>
      </div>

      <div v-if="products.length === 0 || error" class="text-2xl text-gray-500 text-center">Nothing to show</div>

      <div v-else>
        <div class="grid grid-cols-1 gap-x-6 gap-y-10 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <div v-for="product in products">
          <a :key="product.id" :href="'/product/' + product.id" class="group">

            <div
                class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <img v-if="product.imageURL" :src="product.imageURL" :alt="productImg" class="h-full w-full object-cover object-center group-hover:opacity-75" />
              <img v-else :src="productImg" :alt="productImg" class="h-full w-full object-cover object-center group-hover:opacity-75" />
            </div>
            <p class="mt-1 text-lg font-medium text-gray-900">{{ product.price }}</p>
            <h3 class="text-sm text-gray-700">{{ product.name }}</h3>
            <button v-if="userId == props.id" type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Edit</button>
          </a>
          </div>
          </div>

        <div class="flex flex-col items-center mt-10">
          <!-- Help text -->
          <span class="text-sm text-gray-700">
            <span class="font-semibold text-black">{{ currentPage }}</span> page of <span
              class="font-semibold text-black">{{ totalPages }}</span>
          </span>
          <!-- Buttons -->
          <div class="inline-flex mt-2 xs:mt-0">
            <button @click="previousPage" :disabled="currentPage === 1"
                    class="flex items-center justify-center px-3 h-16 w-16 lg:h-8 text-sm font-medium text-black bg-gray-50 rounded-s hover:bg-gray-200">
              Prev
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="flex items-center justify-center px-3 h-16 w-16 lg:h-8 text-sm font-medium text-black bg-gray-50 border-0 border-s border-gray-300 rounded-e hover:bg-gray-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>