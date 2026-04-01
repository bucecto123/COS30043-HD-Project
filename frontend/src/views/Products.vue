<template>
  <div class="page-enter">
    <div class="container py-4">
      <!-- Category Banner -->
      <div class="cat-banner" style="background: linear-gradient(135deg, #e8f0de, #f5eed8);">
        <span class="cat-emoji">🛒</span>
        <div>
          <h2>Da Nang Price Deals</h2>
          <p>Compare Go!, Bách Hoá Xanh, and Lottemart prices instantly</p>
        </div>
        <div class="ms-auto d-none d-md-block">
          <router-link to="/products/new" class="btn-sage">
            ➕ Add Product
          </router-link>
        </div>
      </div>

      <!-- Category pills quick-filter -->
      <div class="filter-chips mb-3">
        <button
          class="cat-pill"
          :class="{ active: activeCategory === null }"
          @click="setCategory(null)"
        >All Deals</button>
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-pill"
          :class="{ active: activeCategory === cat }"
          @click="setCategory(cat)"
        >{{ cat }}</button>
      </div>

      <!-- Filters row -->
      <ProductFilters />

      <!-- Error alert -->
      <div v-if="error" class="bloom-alert bloom-alert-error d-flex align-items-center justify-content-between">
        <span>{{ error }}</span>
        <button class="btn-outline-sage" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;" @click="retryLoad">
          Retry
        </button>
      </div>

      <!-- Skeleton loading -->
      <div v-if="loading && products.length === 0" class="mb-4">
        <div class="row g-3">
          <div v-for="n in skeletonCount" :key="n" class="col-6 col-md-4 col-lg-3">
            <div class="skeleton" style="height: 280px;"></div>
          </div>
        </div>
      </div>

      <!-- Product Grid -->
      <div v-else-if="products.length > 0">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <span style="font-size: 0.88rem; color: var(--espresso-light);">
            <strong>{{ products.length }}</strong> deals found{{ activeCategory ? ` in ${activeCategory}` : '' }}
          </span>
        </div>
        <div class="row g-3">
          <div
            v-for="(product, index) in products"
            :key="product.id"
            class="col-6 col-md-4 col-lg-3 stagger-in"
            :style="{ animationDelay: (index * 0.05) + 's' }"
          >
            <ProductCard :product="product" />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <div class="empty-icon">🛒😔</div>
        <h4>No deals found</h4>
        <p>Try changing your filters or reset them.</p>
        <button class="btn-sage" @click="resetFilters">Reset Filters</button>
      </div>

      <!-- Load More -->
      <LoadMore v-if="products.length > 0" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ProductCard from '../components/ProductCard.vue'
import ProductFilters from '../components/ProductFilters.vue'
import LoadMore from '../components/LoadMore.vue'
import { PRODUCT_CATEGORIES } from '../constants/categories'

const store = useStore()

const activeCategory = ref(null)
const categories = PRODUCT_CATEGORIES

const products = computed(() => store.getters['products/allProducts'])
const loading = computed(() => store.getters['products/isLoading'])
const error = computed(() => store.state.products.error)

const skeletonCount = computed(() => {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth >= 1200) return 8
  if (window.innerWidth >= 768) return 6
  return 4
})

const setCategory = (cat) => {
  activeCategory.value = cat
  store.dispatch('products/setFilter', { key: 'category', value: cat })
  store.dispatch('products/fetchProducts', true)
}

const retryLoad = () => {
  store.dispatch('products/fetchProducts', true)
}

const resetFilters = () => {
  activeCategory.value = null
  store.dispatch('products/resetFilters')
  store.dispatch('products/fetchProducts', true)
}

onMounted(() => {
  store.dispatch('products/fetchStores')
  store.dispatch('products/fetchProducts', true)
})
</script>
