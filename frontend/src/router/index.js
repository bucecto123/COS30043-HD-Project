// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Lazy load views for better performance
const Home = () => import('../views/Home.vue')
const News = () => import('../views/News.vue')
const About = () => import('../views/About.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Products = () => import('../views/Products.vue')
const ProductEdit = () => import('../views/ProductEdit.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/news',
    name: 'News',
    component: News,
    meta: { requiresAuth: false }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { requiresAuth: false }
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
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/products/:id',
    name: 'EditProduct',
    component: ProductEdit,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const isAdmin = store.getters['auth/isAdmin']

  // Protected routes - redirect to login with return URL
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Admin-only routes - redirect non-admins to products page
  if (to.meta.requiresAdmin && !isAdmin) {
    next('/products')
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
