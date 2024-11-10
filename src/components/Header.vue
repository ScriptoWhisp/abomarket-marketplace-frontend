<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import SearchBar from '@/components/SearchBar.vue'
import {useRouter} from "vue-router";


const router = useRouter();

const toPage = () => {
  const isLoggedIn = !!localStorage.getItem('user_token') && !!localStorage.getItem('id');
  if (isLoggedIn) {
    router.push('/user');
    return;
  }

  router.push('/login');
}



const mobileMenuOpen = ref(false)
</script>


<template>
  <div id="header">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
      <div class="hidden lg:flex justify-left items-center">
        <router-link to="/" class="absolute font-extrabold text-white text-5xl">abo.</router-link>
      </div>
      <div class="justify-self-center items-center lg:w-1/2 w-full">
        <SearchBar/>
      </div>
      <div class="hidden lg:flex justify-right items-center">
        <a @click="toPage" class="absolute text-sm font-semibold text-white">Account</a>
      </div>

      <div class="pl-2 flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </nav>
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <router-link to="/" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Features</router-link>
              <router-link to="/" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Marketplace</router-link>
              <router-link to="/" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Company</router-link>
            </div>
            <div class="py-6">
              <router-link to="/" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log in</router-link>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </div>
</template>

