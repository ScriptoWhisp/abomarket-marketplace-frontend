<script setup>

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

</script>

<template>
  <div id="app" class="w-full">
    <Header v-if="!$route.meta.hideHeaderFooter" />

    <router-view />

    <Footer v-if="!$route.meta.hideHeaderFooter" />
  </div>
</template>

<style scoped>
</style>
