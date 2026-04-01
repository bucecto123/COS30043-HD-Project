<template>
  <div class="text-center my-4">
    <button
      v-if="hasMore && !loading"
      class="btn-sage"
      style="padding: 0.8rem 2rem;"
      @click="loadMore"
    >
      ↓ Load More Deals
    </button>

    <div v-if="loading" class="d-flex flex-column align-items-center gap-2">
      <div class="spinner-border text-sage" role="status" style="color: var(--sage);">
        <span class="visually-hidden">Loading...</span>
      </div>
      <span style="font-size: 0.85rem; color: var(--espresso-light);">Loading more products...</span>
    </div>

    <div v-if="!hasMore && !loading" class="end-message">
      <span class="badge-end">✓ You've reached the end</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const loading = computed(() => store.getters['products/isLoading'])
const hasMore = computed(() => store.getters['products/hasMore'])

const loadMore = () => {
  store.dispatch('products/fetchProducts')
}
</script>

<style scoped>
.badge-end {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(122, 139, 111, 0.1);
  color: var(--sage-dark);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
