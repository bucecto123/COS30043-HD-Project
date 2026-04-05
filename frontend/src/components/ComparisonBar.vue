<template>
  <Transition name="bar-slide">
    <div v-if="selectionCount > 0" class="comparison-bar">
      <div class="container d-flex align-items-center gap-3 flex-wrap">
        <div class="bar-left">
          <span class="bar-count">{{ selectionCount }}/{{ MAX_ITEMS }}</span>
          <div class="bar-names">
            <span v-for="p in selectedProducts" :key="p.id" class="bar-chip">
              {{ p.name.length > 18 ? p.name.substring(0, 18) + '…' : p.name }}
            </span>
          </div>
        </div>

        <div class="bar-actions ms-auto">
          <button class="btn-sage" :disabled="!canCompare" @click="openComparison">
            ⚖️ Compare Now
          </button>
          <button class="btn-outline-sage" @click="clearSelection">
            Clear
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { inject } from 'vue'

// Consume the shared comparison state provided by Products.vue
const { selectedProducts, selectionCount, canCompare, MAX_ITEMS, clearSelection, openComparison } =
  inject('comparison')
</script>

<style scoped>
.comparison-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 500;
  background: rgba(255, 248, 240, 0.97);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 2px solid var(--sage);
  padding: 0.75rem 0;
  box-shadow: 0 -6px 28px rgba(59, 47, 47, 0.1);
}

.bar-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.bar-count {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--sage-dark);
  white-space: nowrap;
}

.bar-names {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.bar-chip {
  background: rgba(122, 139, 111, 0.12);
  color: var(--espresso);
  font-size: 0.78rem;
  padding: 0.2rem 0.65rem;
  border-radius: 50px;
}

.bar-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Slide up / down transition */
.bar-slide-enter-active,
.bar-slide-leave-active {
  transition: transform 0.28s ease, opacity 0.28s ease;
}
.bar-slide-enter-from,
.bar-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
