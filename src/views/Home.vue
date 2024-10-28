<script setup>

import Footer from "@/components/Footer.vue";
import HeaderPopover from "@/components/HeaderPopover.vue";
import ProductList from "@/components/ProductList.vue";

</script>

<template>
  <header class="bg-black w-full">
    <HeaderPopover/>
  </header>

  <body>
    <ProductList/>
  </body>

  <footer>
    <Footer/>
  </footer>
</template>


<style scoped>

</style>