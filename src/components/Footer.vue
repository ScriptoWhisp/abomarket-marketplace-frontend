<script setup>
import { ref, onMounted } from "vue";
import {useRouter} from "vue-router";
import {getIsAdminFromToken} from "@/helpers/JWTHelper.js";

const router = useRouter();
const isAdmin = getIsAdminFromToken(localStorage.getItem('user_token'));

</script>

<template>
  <footer class="bg-black">
    <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
      <div class="sm:flex sm:items-center sm:justify-between">
        <a href="#" class="flex items-center mb-4 sm:mb-0 space-x-3 text-3xl text-white font-extrabold rtl:space-x-reverse">abomarket</a>
        <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-blue sm:mb-0 dark:text-gray-400">
          <li v-if="isAdmin">
            <a href="/admin" class="hover:underline">Admin</a>
          </li>
        </ul>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="#" class="hover:underline">abomarket™</a>. All Rights Reserved.</span>
    </div>
  </footer>

</template>

<style scoped>

</style>