<script setup>

import HeaderPopover from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import {onMounted, ref} from "vue";
import { useRouter } from 'vue-router';

const email = ref('');
const firstName = ref('');
const lastName = ref('');
const location = ref('');
const phone = ref('');

const initialEmail = ref('');
const initialFirstName = ref('');
const initialLastName = ref('');
const initialLocation = ref('');
const initialPhone = ref('');

const router = useRouter();
const error = ref('');

const getUsersData = async () => {

  if (!localStorage.getItem('user_token')) {
    await router.push('/login');
    localStorage.clear();
    return;
  }

  try {
    const response = await axios.get('/api/users/profile');
    console.log(response.data);
    email.value = response.data.email;
    firstName.value = response.data.firstName;
    lastName.value = response.data.lastName;
    location.value = response.data.location;
    phone.value = response.data.phone;

    initialEmail.value = response.data.email;
    initialFirstName.value = response.data.firstName;
    initialLastName.value = response.data.lastName;
    initialLocation.value = response.data.location;
    initialPhone.value = response.data.phone;

  } catch (ex) {
    await router.push('/login');
    error.value = ex;
    console.log(ex);
  }

}

const updateData = async () => {
  try {
    const response = await axios.patch('api/users/profile', {
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      location: location.value
    });
    console.log(response);
    await router.push('/user');
  } catch (err) {
    error.value = 'Error updating user: ' + err.message;
  }
}

const logout = async () => {
  localStorage.removeItem('user_token');
  await router.push('/');
}

const resetForm = () => {
  email.value = initialEmail.value;
  firstName.value = initialFirstName.value;
  lastName.value = initialLastName.value;
  location.value = initialLocation.value;
  phone.value = initialPhone.value;
}

onMounted(getUsersData)

</script>

<template>

  <body>
  <div v-if="error" class="error-message">{{ error }}</div>

  <div class="flex justify-left h-dvh">
      <div class="h-full p-5 bg-gray-200 w-1/4">
        <ul class="space-y-2 font-medium origin-top">
          <li>
            <a href="/user/profile" class="flex items-center p-2 text-gray-900 rounded-lg focus:bg-gray-300 hover:bg-gray-300 group">
              <span class="ms-3">Profile</span>
            </a>
          </li>
          <li>
            <a href="/user/createproduct" class="flex items-center p-2 text-gray-900 rounded-lg focus:bg-gray-300 hover:bg-gray-300 group">
              <span class="ms-3">Create Product</span>
            </a>
          </li>
          <li>
            <a href="#" v-on:click="logout" class="flex items-center p-2 text-gray-900 rounded-lg focus:bg-gray-300 hover:text-white hover:bg-red-500 group">
              <span class="ms-3">Logout</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="bg-white w-3/4 lg:w-1/2">
        <form @submit.prevent="updateData">
          <div class="p-5 space-y-12">

            <div class="border-b border-gray-900/10 pb-12">
              <h2 class="text-4xl font-semibold text-gray-900">Profile</h2>
              <p class="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

              <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <label for="first-name" class="block text-sm/6 font-medium text-gray-900">First name</label>
                  <div class="mt-2">
                    <input v-model="firstName" type="text" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                  </div>
                </div>

                <div class="sm:col-span-1">
                  <label for="last-name" class="block text-sm/6 font-medium text-gray-900">Last name</label>
                  <div class="mt-2">
                    <input v-model="lastName" type="text" name="last-name" id="last-name" autocomplete="family-name" class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                  </div>
                </div>

                <div class="sm:col-span-1">
                  <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                  <div class="mt-2">
                    <input v-model="email" id="email" name="email" type="email" autocomplete="email" class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                  </div>
                </div>

                <div class="sm:col-span-1">
                  <label for="first-name" class="block text-sm/6 font-medium text-gray-900">Phone number</label>
                  <div class="mt-2">
                    <input v-model="phone" type="text" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                  </div>
                </div>

                <div class="col-span-2">
                  <label for="location" class="block text-sm/6 font-medium text-gray-900">Location</label>
                  <div class="mt-2">
                    <input id="location" name="location" type="text" class="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-end gap-x-6 p-5">
            <button @click="resetForm" type="button" class="text-sm/6 font-semibold text-gray-900">Cancel</button>
            <button type="submit" class="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
          </div>
        </form>
      </div>
      <div class="bg-white w-1/4"></div>
    </div>


  </body>


  <footer>
    <Footer/>
  </footer>


</template>
