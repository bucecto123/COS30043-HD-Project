<template>
  <div class="filters-card bg-card p-3 mb-4" style="border-radius: var(--radius-lg); border: 1px solid rgba(122, 139, 111, 0.1);">
    <div class="row g-3 align-items-end">
      <div class="col-12 col-md-5">
        <label class="bloom-label">Search deals, brands...</label>
        <input
          type="text"
          class="bloom-input"
          v-model="searchInput"
          placeholder="🔍 Search products..."
          @input="debouncedSearch"
        >
      </div>

      <div class="col-12 col-md-3">
        <label class="bloom-label">Store</label>
        <select class="bloom-select" v-model="selectedStore" @change="applyFilters">
          <option :value="null">All Stores</option>
          <option v-for="s in stores" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>

      <div class="col-12 col-md-4 d-flex gap-2">
        <button class="btn-sage flex-fill" @click="applyFilters">
          ✓ Apply
        </button>
        <button class="btn-outline-sage" @click="resetAllFilters">
          ↺ Reset
        </button>
      </div>
    </div>

    <div v-if="activeFilters.length" class="d-flex flex-wrap gap-2 mt-3">
      <span
        v-for="filter in activeFilters"
        :key="filter.key"
        class="filter-tag"
      >
        {{ filter.label }}
        <button @click="clearFilter(filter.key)" class="filter-tag-close">×</button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const searchInput = ref('')
const selectedStore = ref(null)

const stores = computed(() => store.getters['products/stores'])

const RESET_FETCH = true
const SEARCH_DEBOUNCE_MS = 400
const searchTimeout = ref(null)

const activeFilters = computed(() => {
  const list = []
  if (searchInput.value) list.push({ key: 'search', label: `Search: ${searchInput.value}` })
  if (selectedStore.value) {
    const s = stores.value.find(item => item.id === selectedStore.value)
    list.push({ key: 'storeId', label: `Store: ${s?.name || selectedStore.value}` })
  }
  return list
})

const debouncedSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    store.dispatch('products/setFilter', { key: 'search', value: searchInput.value })
    store.dispatch('products/fetchProducts', RESET_FETCH)
  }, SEARCH_DEBOUNCE_MS)
}

const applyFilters = () => {
  store.dispatch('products/setFilter', { key: 'storeId', value: selectedStore.value })
  store.dispatch('products/fetchProducts', RESET_FETCH)
}

const clearFilter = (key) => {
  if (key === 'search') searchInput.value = ''
  if (key === 'storeId') selectedStore.value = null

  const value = key === 'search' ? '' : null
  store.dispatch('products/setFilter', { key, value })
  store.dispatch('products/fetchProducts', RESET_FETCH)
}

const resetAllFilters = () => {
  searchInput.value = ''
  selectedStore.value = null
  store.dispatch('products/resetFilters')
  store.dispatch('products/fetchProducts', RESET_FETCH)
}

onBeforeUnmount(() => {
  clearTimeout(searchTimeout.value)
})
</script>

<style scoped>
.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  background: rgba(122, 139, 111, 0.1);
  color: var(--sage-dark);
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 500;
}

.filter-tag-close {
  background: none;
  border: none;
  color: var(--sage-dark);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.2rem;
}

.filter-tag-close:hover {
  color: var(--terracotta);
}
</style>
