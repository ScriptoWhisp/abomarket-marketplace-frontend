<script setup>

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import ErrorMessage from "@/components/ErrorAlert.vue";
import {ref, onMounted} from "vue";

const globalErrorMessage = ref("");

onMounted(() => {
  window.addEventListener("global-error", (event) => {
    globalErrorMessage.value = event.detail;
  });
});
</script>

<template>
  <div id="app" class="w-full">
    <Header v-if="!$route.meta.hideHeaderFooter" />

    <router-view />

    <ErrorMessage v-bind:message="globalErrorMessage" v-bind:duration="5000" />

    <Footer v-if="!$route.meta.hideHeaderFooter" />
  </div>
</template>

<style scoped>

</style>
