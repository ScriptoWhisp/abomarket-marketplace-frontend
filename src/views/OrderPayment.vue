<script setup>
import {ref, onMounted, computed} from "vue";
import axios from "axios";
import { getUserIdFromToken } from "@/helpers/JWTHelper";
import { triggerError } from "@/helpers/ErrorHelper.js";

const props = defineProps({
  id: String
});

const token = localStorage.getItem('user_token');
const userId = getUserIdFromToken(token);
console.log(userId);

const productImg = 'https://www.diskmat.ee/raamat12.gif';
const cart = ref([]);
const currentPage = ref(1);
const pageSize = 4;
const totalPages = ref(1);

const productList = ref([]);
const userData = ref({});

const sumOfPrices = computed(() => {
  return productList.value.reduce((sum, product) => sum + product.price * product.quantity, 0);
});

const fetched = ref(false);

const fetchCart = async () => {
  try {

    const userResponse = await axios.get('/api/users/profile');
    userData.value = userResponse.data;
    const response = await axios.get(`/api/order_items?orderId=${userData.value.unfinishedOrderId}&pageNo=${currentPage.value - 1}&pageSize=${pageSize}`);

    cart.value = response.data.content.map(cartItem => ({
      id: cartItem.id,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: cartItem.priceAtTimeOfOrder

    }));

    await convertCartToProductList();

    totalPages.value = response.data.totalPages;
    fetched.value = true;
  } catch (err) {
    triggerError('Error fetching products: ' + err.message);
  }
};


const convertCartToProductList = async () => {
  try {
    const tempProductList = [];
    for (const element of cart.value) {
      const response = await axios.get(`/api/products/${element.productId}`);
      const product = { ...response.data, quantity: element.quantity };
      tempProductList.push(product);
    }
    productList.value = tempProductList; // Update once after processing
  } catch (err) {
    triggerError('Error converting cart: ' + err.message);
  }
};


const placeOrder = async () => {
  try {
    // placing order = changing status to 1 (placed), removing this orderId from user and replacing it with a new one with status 0 (cart)
    const changeOrderStatusResponse = await axios.patch(`/api/orders/${userData.value.unfinishedOrderId}`, {
      statusId: 1
    });
    console.log(changeOrderStatusResponse);

    const createOrderResponse = await axios.post(`/api/orders`, {
      userId: userData.value.id,
      statusId: 0
    });
    console.log(createOrderResponse);


    await axios.patch(`api/users/profile`, {
      unfinishedOrderId: createOrderResponse.data.id
    });
    console.log('Order placed');

    window.location.href = '/user';
  } catch (err) {
    triggerError('Error placing order: ' + err.message);
  }
};

const loadUserData = async () => {
  try {
    const response = await axios.get('/api/users/profile');
    userData.value = response.data;
    console.log(userData.value);
  } catch (err) {
    triggerError('Error fetching user data: ' + err.message);
  }
};

onMounted(loadUserData);
onMounted(fetchCart); // Pass function reference
</script>


<template>

  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8" v-if="fetched">


      <h2 class="text-black text-5xl">Payment</h2>
      <h3 class="text-black text-4xl">Total price: {{ sumOfPrices }}</h3>



      <div class="flex justify-start">
        <router-link to="/user/cart" class="text-black text-left hover:underline">Back to cart</router-link>
      </div>


      <div class="mt-10" v-if="productList.length > 0">

        <div class="w-1/2 inline-block">
      <h1 class="text-5xl text-black bold">your products </h1>
      <div class="flex flex-col">
        <div v-for="product in productList">
          <div class="flex justify-between">
            <div>
              <h2 class="text-3xl text-black">{{ product.name }}</h2>
              <p class="text-2xl text-black">{{ product.price }} €</p>
              <p class="text-2xl text-black">Quantity: {{ product.quantity }}</p>
            </div>
            <div>
              <img :src="productImg" alt="description" class="h-auto w-1/2">
            </div>
          </div>
        </div>
      </div>
        </div>
        <div class="w-1/2 inline-block">
          <h1 class="text-5xl text-black bold mb-10">Payment details</h1>

          <h3 class="text-3xl text-black">Name: </h3> <p class="text-black text-2xl">{{userData.firstName + " " + userData.lastName}}</p><br>
          <h3 class="text-3xl text-black">Location: </h3> <p class="text-black text-2xl">{{ userData.location }}</p><br>

          <h3 class="text-3xl text-black">Email: </h3> <p class="text-black text-2xl">{{ userData.email }}</p><br>
          <h3 class="text-3xl text-black">Phone number: </h3> <p class="text-black text-2xl">{{ userData.phone }}</p><br>

          <h3 class="text-4xl">No payment system yet</h3>
          <button @click="placeOrder" class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Place order</button>
        </div>


    </div>
  </div>
  </div>
</template>

<style scoped>

</style>