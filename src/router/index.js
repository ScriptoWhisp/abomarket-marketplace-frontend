// src/routes/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import UserPage from '@/views/UserPage.vue';
import UserProductsPage from '@/views/UserProductsPage.vue';
import ProductCreatePage from '@/views/ProductCreatePage.vue';
import ProductPage from '@/views/ProductPage.vue';
import ForeignUser from '@/views/ForeignUser.vue';
import ForeignUsers from "@/views/ForeignUsers.vue";
import Cart from "@/views/Cart.vue";
import OrderPayment from "@/views/OrderPayment.vue";
import Orders from "@/views/Orders.vue";
import OrderItems from "@/views/OrderItems.vue";
import AdminPanel from "@/views/AdminPanel.vue";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { hideHeaderFooter: true, requiresAuth: false }
    },
    {
        path: '/user',
        name: 'User',
        component: UserPage,
    },
    {
      path: '/user/:id/products',
      name: 'UserProducts',
      component: UserProductsPage,
      props: true,
      meta: { requiresAuth: false }
    },
    // {
    //   path: '/user/products',
    //   name: 'UserOwnProducts',
    //   component: UserProductsPage
    //
    // },
    {
        path: '/user/createproduct',
        name: 'CreateProduct',
        component: ProductCreatePage
    },
    {
        path: '/product/:id',
        name: 'Product',
        component: ProductPage,
        props: true,
        meta: { requiresAuth: false }
    },
    {
        path: '/user/:id',
        name: 'ForeignUser',
        component: ForeignUser,
        props: true,
        meta: { requiresAuth: false }
    },
    {
        path: '/users',
        name: 'Users',
        component: ForeignUsers,
        meta: { requiresAuth: false }
    },
    {
        path: '/user/cart',
        name: 'Cart',
        component: Cart,
        meta: { requiresAuth: true}
    },
    {
        path: '/payment',
        name: 'Payment',
        component: OrderPayment,
        meta: { requiresAuth: true}
    },
    {
        path: '/orders',
        name: 'Orders',
        component: Orders,
        meta: { requiresAuth: true}
    },
    {
        path: '/orders/:id',
        name: 'SpecificOrder',
        component: OrderItems,
        props: true,
        meta: { requiresAuth: true}
    },
    {
        path: '/admin',
        name: 'AdminPanel',
        component: AdminPanel,
        meta: { requiresAuth: true}
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;