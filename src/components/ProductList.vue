<script setup>

import { ref, onMounted } from "vue";
import axios from "axios";

const productImg = 'https://www.diskmat.ee/raamat12.gif'
const products = ref([]);
const currentPage = ref(1);
const pageSize = 10;
const totalPages = ref(1);

const error = ref('');

const fetchProducts = async () => {
  try {
    const response = await axios.get(`/api/products?pageNo=${currentPage.value - 1}&pageSize=${pageSize}`);
    console.log(response);
    products.value = response.data.content.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
    }));
    totalPages.value = response.data.totalPages;
  } catch (err) {
    error.value = 'Error fetching products: ' + err.message;
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
  <div v-if="error" class="error-message">{{ error }}</div>

  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">


      <h2 class="text-black text-5xl mb-10">Products</h2>

      <!-- filter stuff goes here -->

      <!-- and here it ends -->

      <div v-if="products.length === 0 || error" class="text-2xl text-gray-500 text-center">Nothing to show</div>

      <div v-else>
        <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <a v-for="product in products" :key="product.id" :href="product.href" class="group">

            <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <img :src="productImg" :alt="productImg" class="h-full w-full object-cover object-center group-hover:opacity-75" />
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