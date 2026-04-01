<template>
  <nav class="bloom-nav" :class="{ scrolled: scrolled }">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between">
        <router-link to="/products" class="navbar-brand d-flex align-items-center gap-2">
          <span class="brand-icon">🛒</span>
          <span class="brand-text">Da Nang<span class="brand-accent">Deals</span></span>
        </router-link>
        
        <div class="category-pills d-none d-md-flex">
          <button 
            class="cat-pill" 
            :class="{ active: activeCategory === null }"
            @click="setCategory(null)"
          >
            All
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat"
            class="cat-pill"
            :class="{ active: activeCategory === cat }"
            @click="setCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
        
        <div class="d-flex align-items-center gap-3">
          <router-link to="/products/new" class="nav-icon-btn" title="Add Product">
            ➕
          </router-link>
          
          <div class="position-relative" v-if="isAuthenticated" @click.stop>
            <button class="user-avatar" @click="showUserMenu = !showUserMenu">
              {{ userInitial }}
            </button>
            <transition name="dropdown">
              <div class="user-dropdown" v-if="showUserMenu">
                <div class="dropdown-header">
                  <span class="dropdown-username">{{ user?.username }}</span>
                  <span class="dropdown-role">{{ user?.role || 'user' }}</span>
                </div>
                <div class="dropdown-divider-custom"></div>
                <router-link to="/products" class="dropdown-item" @click="showUserMenu = false">
                  📦 My Products
                </router-link>
                <div class="dropdown-divider-custom"></div>
                <button class="dropdown-item text-danger" @click="handleLogout">
                  🚪 Sign Out
                </button>
              </div>
            </transition>
          </div>
          
          <div v-else class="d-flex gap-2">
            <router-link to="/login" class="btn-outline-sage">Sign In</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { PRODUCT_CATEGORIES } from '../constants/categories'

const store = useStore()
const router = useRouter()

const scrolled = ref(false)
const showUserMenu = ref(false)
const activeCategory = ref(null)

const categories = PRODUCT_CATEGORIES
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const user = computed(() => store.getters['auth/user'])
const userInitial = computed(() => user.value?.username?.charAt(0)?.toUpperCase() || 'U')

const setCategory = (cat) => {
  activeCategory.value = cat
  store.dispatch('products/setFilter', { key: 'category', value: cat })
  store.dispatch('products/fetchProducts', true)
  router.push('/products')
}

const handleLogout = () => {
  store.dispatch('auth/logout')
  showUserMenu.value = false
  router.push('/login')
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 10
}

const handleClickOutside = (e) => {
  const dropdown = document.querySelector('.user-dropdown')
  const avatar = document.querySelector('.user-avatar')
  if (dropdown && !dropdown.contains(e.target) && !avatar?.contains(e.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.brand-icon {
  font-size: 1.5rem;
}

.brand-text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--espresso);
  letter-spacing: -0.5px;
}

.brand-accent {
  color: var(--sage);
}

.dropdown-header {
  padding: 0.8rem 1rem;
  text-align: center;
}

.dropdown-username {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--espresso);
}

.dropdown-role {
  display: block;
  font-size: 0.75rem;
  color: var(--espresso-light);
  text-transform: capitalize;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.6rem 1rem;
  border: none;
  background: none;
  text-align: left;
  font-size: 0.88rem;
  color: var(--espresso);
  cursor: pointer;
  font-family: var(--font-body);
  text-decoration: none;
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: rgba(122, 139, 111, 0.08);
}

.dropdown-item.text-danger {
  color: var(--tomato);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
