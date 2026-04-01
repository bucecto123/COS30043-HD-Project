// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Products from '../views/Products.vue'
import ProductEdit from '../views/ProductEdit.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    redirect: '/products'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/new',
    name: 'NewProduct',
    component: ProductEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id',
    name: 'EditProduct',
    component: ProductEdit,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']

  // Protected routes - redirect to login with return URL
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Guest-only routes (login/register) - redirect authenticated users
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/products')
    return
  }

  next()
})

export default router
