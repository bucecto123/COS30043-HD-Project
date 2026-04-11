<template>
  <nav class="bloom-nav" :class="{ scrolled: scrolled }">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between">
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
          <span class="brand-icon">🛒</span>
          <span class="brand-text">Da Nang <span class="brand-accent">Deals</span></span>
        </router-link>
        
        <!-- Main Navigation Links -->
        <div class="nav-links d-none d-md-flex">
          <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">Home</router-link>
          <router-link to="/products" class="nav-link" :class="{ active: $route.path.startsWith('/products') }">Products</router-link>
          <router-link to="/news" class="nav-link" :class="{ active: $route.path === '/news' }">News</router-link>
          <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">About</router-link>
        </div>
        
        <div class="d-flex align-items-center gap-3">
          <!-- Add Product hidden: products are real crawled data -->
          
          <router-link v-if="isAdmin" to="/products/new" class="btn-sage" style="font-size: 0.85rem; padding: 0.45rem 1rem;">
            + Add Product
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
                <router-link to="/products/new" class="dropdown-item" @click="showUserMenu = false">
                  ➕ Add Product
                </router-link>
                <router-link to="/products" class="dropdown-item" @click="showUserMenu = false">
                  📦 Browse Products
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

          <!-- Mobile menu toggle -->
          <button class="mobile-menu-btn d-md-none" @click="showMobileMenu = !showMobileMenu">
            {{ showMobileMenu ? '✕' : '☰' }}
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <transition name="slide">
        <div v-if="showMobileMenu" class="mobile-nav d-md-none">
          <router-link to="/" class="mobile-nav-link" @click="showMobileMenu = false">🏠 Home</router-link>
          <router-link to="/products" class="mobile-nav-link" @click="showMobileMenu = false">🛒 Products</router-link>
          <router-link to="/news" class="mobile-nav-link" @click="showMobileMenu = false">📰 News</router-link>
          <router-link to="/about" class="mobile-nav-link" @click="showMobileMenu = false">ℹ️ About</router-link>
          <router-link v-if="isAdmin" to="/products/new" class="mobile-nav-link" @click="showMobileMenu = false">➕ Add Product</router-link>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const scrolled = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const isAdmin = computed(() => store.getters['auth/isAdmin'])
const user = computed(() => store.getters['auth/user'])
const userInitial = computed(() => user.value?.username?.charAt(0)?.toUpperCase() || 'U')

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

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: var(--espresso-light);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--espresso);
  background: rgba(122, 139, 111, 0.08);
}

.nav-link.active {
  color: var(--sage-dark);
  background: rgba(122, 139, 111, 0.12);
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

.mobile-menu-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
}

.mobile-nav {
  padding: 1rem 0;
  border-top: 1px solid rgba(122, 139, 111, 0.1);
  margin-top: 1rem;
}

.mobile-nav-link {
  display: block;
  padding: 0.75rem 0;
  color: var(--espresso);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid rgba(122, 139, 111, 0.08);
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
