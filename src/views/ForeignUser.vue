<script setup>

import axios from "axios";
import {onMounted, ref} from "vue";
import { useRouter } from 'vue-router';
import {triggerError} from "@/helpers/ErrorHelper.js";

const email = ref('');
const firstName = ref('');
const lastName = ref('');
const location = ref('');
const phone = ref('');


const props = defineProps({
  id: String
});

const getForeignUsersData = async () => {

  try {
    const response = await axios.get(`/api/users/${props.id}`);
    console.log(response.data);
    email.value = response.data.email;
    firstName.value = response.data.firstName;
    lastName.value = response.data.lastName;
    location.value = response.data.location;
    phone.value = response.data.phone;

  } catch (ex) {
    triggerError(ex);
  }

}

onMounted(getForeignUsersData)
</script>

<template>

  <div class="grid grid-cols-5 bg-white">
    <div class="py-5 px-5 sm:px-20 col-start-2 col-span-3">
      <div class="px-4 sm:px-0">
        <h3 class="text-base/7 font-semibold text-gray-900">User Information</h3>
        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details</p>
      </div>
      <div class="mt-6 border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm/6 font-medium text-gray-900">First name</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ firstName }}</dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm/6 font-medium text-gray-900">Last name</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ lastName }}</dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm/6 font-medium text-gray-900">Email address</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ email }}</dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm/6 font-medium text-gray-900">Location</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ location }}</dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm/6 font-medium text-gray-900">phone</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ phone }}</dd>
          </div>
        </dl>
      </div>
      <div>
        <router-link to="/users" class="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">View All Users</router-link>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>