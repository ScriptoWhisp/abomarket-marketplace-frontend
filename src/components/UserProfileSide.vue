<script setup>

import { useRouter } from 'vue-router';
import {getUserIdFromToken} from "@/helpers/JWTHelper.js";

const router = useRouter();

const token = localStorage.getItem('user_token');
const userId = getUserIdFromToken(token);

const logout = async () => {
  localStorage.removeItem('user_token');
  await router.push('/');
}

</script>

<template>
  <div class="h-full p-5 bg-gray-200 w-1/4">
    <ul class="space-y-2 font-medium origin-top">
      <li>
        <a href="/user" class="flex items-center p-2 text-gray-900 rounded-lg focus:bg-gray-300 hover:bg-gray-300 group">
          <span class="ms-3">Profile</span>
        </a>
      </li>
      <li>
        <a href="/user/createproduct" class="flex items-center p-2 text-gray-900 rounded-lg focus:bg-gray-300 hover:bg-gray-300 group">
          <span class="ms-3">Create Product</span>
        </a>
      </li>
      <li>
        <a :href="'/user/' + userId + '/products'" class="flex items-center p-2 text-gray-900 rounded-lg focus:bg-gray-300 hover:bg-gray-300 group">
          <span class="ms-3">View Products</span>
        </a>
      </li>
      <li>
        <a href="#" v-on:click="logout" class="flex items-center p-2 text-gray-900 rounded-lg focus:bg-gray-300 hover:text-white hover:bg-red-500 group">
          <span class="ms-3">Logout</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>