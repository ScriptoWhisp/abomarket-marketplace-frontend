<script setup>

import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const isRegister = ref(false);

const login = async () => {

  localStorage.removeItem('user_token');
  localStorage.removeItem('id');

  try {

    const response = await axios.post('/api/public/login', {
      email: email.value,
      password: password.value,
    });

    error.value = response.data.error;

    const token = response.data.jwtToken;
    const id = response.data.id;

    localStorage.setItem('user_token', token);
    localStorage.setItem('id', id);

    await router.push('/');

  } catch (err) {
    error.value = 'Invalid email or password';
  }
};

const register = async () => {

  try {

    await axios.post('api/users', {
      email: email.value,
      password: password.value,
    });

    await router.push('/login');

  } catch (err) {
    error.value = 'Invalid email or password';
  }
};

</script>

<template>
  <body class="bg-white">

    <div v-if="error" class="error-message text-black">{{ error }}</div>


    <div v-if="isRegister" class="flex min-h-full flex-col content-center justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl/9 font-bold text-gray-900">Sign up new account</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="register" method="POST">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div class="mt-2">
              <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
            </div>
            <div class="mt-2">
              <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
            </div>
          </div>

          <div>
            <button type="submit" class="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Already a member?
          <a href="#" @click="isRegister = false" class="font-semibold text-gray-800 hover:text-gray-800 hover:underline">Sign up</a>
        </p>
      </div>
    </div>

    <div v-else class="flex min-h-full flex-col content-center justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl/9 font-bold text-gray-900">Sign in to your account</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="login" method="POST">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div class="mt-2">
              <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
              <div class="text-sm">
                <a href="#" class="font-semibold text-gray-800 hover:text-gray-800 hover:underline">Forgot password?</a>
              </div>
            </div>
            <div class="mt-2">
              <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
            </div>
          </div>

          <div>
            <button type="submit" class="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Not a member?
          <a href="#" @click="isRegister = true" class="font-semibold text-gray-800 hover:text-gray-800 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  </body>
</template>
