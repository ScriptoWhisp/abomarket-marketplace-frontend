<script setup>

import { ref, onMounted } from "vue";
import axios from "axios";

const productImg = 'https://www.diskmat.ee/raamat12.gif'
const products = ref([]);
const error = ref('');

const fetchBooks = async () => {
  try {
    const response = await axios.get('/api/products');
    products.value = response.data.map(product => ({
      id: product.id, // Assuming there's an id field
      name: product.name,
      price: product.price,
    }));
  } catch (err) {
    error.value = 'Error fetching products: ' + err.message;
  }
};

onMounted(fetchBooks);

</script>

<template>
  <div v-if="error" class="error-message">{{ error }}</div>

  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="sr-only">Products</h2>

      <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <a v-for="product in products" :key="product.id" :href="product.href" class="group">

          <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
            <img :src="productImg" :alt="productImg" class="h-full w-full object-cover object-center group-hover:opacity-75" />
          </div>
          <p class="mt-1 text-lg font-medium text-gray-900">{{ product.price }}</p>
          <h3 class="text-sm text-gray-700">{{ product.name }}</h3>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>