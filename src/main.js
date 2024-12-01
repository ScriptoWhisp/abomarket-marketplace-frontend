import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

const token = localStorage.getItem('user_token')

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

router.beforeEach((to, from, next) => {
  // Default requiresAuth to true if not explicitly defined
  const requiresAuth = to.meta.requiresAuth !== false

  console.log('requiresAuth', requiresAuth)

  const token = localStorage.getItem('user_token')

  if (requiresAuth && !token) {
    // Redirect to login if authentication is required and the user is not authenticated
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    next('/login')
  } else {
    next()
  }
})


const app = createApp(App)

app.config.globalProperties.$showError = (message) => {
  const event = new CustomEvent("global-error", { detail: message });
  window.dispatchEvent(event);
};

app.provide('axios', axios)

app.use(router)

app.mount('#app')
