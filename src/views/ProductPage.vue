<script setup>
import HeaderPopover from "@/components/Header.vue";
import {onMounted, ref} from "vue";
import axios from "axios";

const props = defineProps({
  id: String
});

const product = ref({});
const category = ref("");
const seller = ref({});
const productImg = 'https://www.diskmat.ee/raamat12.gif'
const error = ref('');


const fetchProduct = async () => {
  try {
    const response = await axios.get(`/api/products/${props.id}`);
    console.log(response);
    product.value = response.data;

    await fetchCategory();
    await fetchSellerName();
  } catch (err) {
    error.value = 'Error fetching products: ' + err.message;
  }
};

const fetchCategory = async () => {
  try {
    const response = await axios.get(`/api/categories/${product.value.categoryId}`);
    console.log(response);
    category.value = response.data.name;
  } catch (err) {
    error.value = 'Error fetching products: ' + err.message;
  }
};


const fetchSellerName = async () => {
  try {
    const response = await axios.get(`/api/users/${product.value.sellerId}`);
    console.log(response);
    seller.value = response.data;
  } catch (err) {
    error.value = 'Error fetching products: ' + err.message;
  }
};


onMounted(fetchProduct);
</script>

<template>
  <header class="bg-black w-full">
    <HeaderPopover/>
  </header>


  <body>
  <div class="w-10/12 m-auto columns-2">
      <img class="inline h-auto w-1/2" :src="productImg" alt="description">
      <h2 class="text-black text-5xl ml-20 mb-10">{{product.name}}</h2>
      <h3 class="text-black text-4xl ml-20 mb-10">Category: {{category}}</h3>
      <a :href="'/user/' + seller.id + '/products'"><h4 class="text-black text-4xl ml-20 mb-10">Seller: {{seller.firstName}} (click to see other products) </h4></a>
      <h5 class="text-black text-4xl ml-20 mb-10 w-3/12">Price: {{product.price}}</h5>
      <p class="text-black text-2xl ml-20 mb-10">{{product.description}}</p>
  </div>

  </body>
</template>

<style scoped>

</style>