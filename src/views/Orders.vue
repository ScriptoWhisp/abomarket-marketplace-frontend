<script setup>
import {ref, onMounted} from "vue";
import axios from "axios";
import { getUserIdFromToken } from "@/helpers/JWTHelper";
import { triggerError } from "@/helpers/ErrorHelper.js";

const token = localStorage.getItem('user_token');
const userId = getUserIdFromToken(token);
console.log(userId);

const orders = ref([]);
const currentPage = ref(1);
const pageSize = 4;
const totalPages = ref(1);

const statusIdToName = {};

const loaded = ref(false);


const fetchOrders = async () => {
  try {

    const response = await axios.get(`/api/orders?userId=${userId}&pageNo=${currentPage.value - 1}&pageSize=${pageSize}`);
    orders.value = response.data.content.map(order => ({
      id: order.id,
      statusId: order.statusId
    }));

    for (const element of orders.value) {
      await convertStatus(element.statusId);
    }

    totalPages.value = response.data.totalPages;
    loaded.value = true;

  } catch (err) {
    triggerError('Error fetching products: ' + err.message);
  }
};

const convertStatus = async (role) => {
  try {
    if (statusIdToName[role] !== undefined) {
      return;
    }

    const response = await axios.get(`/api/statuses/${role}`);
    statusIdToName[role] = response.data.name;
    console.log(statusIdToName);
  } catch (err) {
    triggerError('Error fetching status: ' + err.message);
  }
};

const nextPage = () => {
  currentPage.value++;
  fetchOrders();
};

const previousPage = () => {
  currentPage.value--;
  fetchOrders()
};

onMounted(fetchOrders); // Pass function reference
</script>


<template>

  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8" v-if="loaded">


      <h2 class="text-black text-5xl">Order list</h2>


      <!-- filter stuff goes here -->

      <!-- and here it ends -->

      <div class="flex justify-start">
        <router-link to="/user" class="text-black text-left hover:underline">Back to profile</router-link>
      </div>

      <div class="mt-10">
        <div v-for="order in orders" class="flex justify-between items-center py-4 border-b border-gray-200">
          <div hidden>{{convertStatus(order.statusId)}}</div>
          <div>
            <h3 class="text-black text-3xl">Order ID: {{ order.id }}</h3>
            <p class="text-black text-2xl">Order status: {{ statusIdToName[order.statusId] }}</p>
            <a :href="'/orders/' + order.id" class="text-blue-800 text-2xl hover:underline">View order</a>
          </div>
        </div>
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
</template>

<style scoped>

</style>