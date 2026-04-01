<template>
  <div class="product-card h-100" @click="goToEdit">
    <div class="card-img-wrap">
      <img v-if="product.image && !imgError" :src="product.image" :alt="product.name" @error="imgError = true" class="product-img" />
      <span v-else class="product-emoji">🛒</span>
      <div v-if="maxDiscount > 0" class="discount-badge">
        -{{ maxDiscount }}%
      </div>
    </div>

    <div class="card-body">
      <span class="store-tag">📦 {{ product.brand || 'Various' }}</span>
      <div class="product-name">{{ product.name }}</div>
      <div class="text-espresso-light" style="font-size: 0.8rem;">{{ product.unit }}</div>

      <div class="price-list mt-2">
        <div v-for="price in product.prices" :key="price.storeId" class="price-item">
          <div class="d-flex justify-content-between align-items-center">
            <span class="store-name">{{ getStoreName(price.storeId) }}</span>
            <div class="text-end">
              <span class="product-price">{{ formatPrice(price.salePrice || price.regularPrice) }}</span>
              <span v-if="price.salePrice" class="old-price">{{ formatPrice(price.regularPrice) }}</span>
            </div>
          </div>
          <div class="d-flex gap-1 mt-1 flex-wrap">
            <span v-if="isBestPrice(price)" class="badge-best">🏆 Best</span>
            <span v-if="getDiscountPercent(price) > 0" class="badge-save">-{{ getDiscountPercent(price) }}%</span>
          </div>
        </div>
      </div>

      <div class="mt-3" v-if="isLoggedIn">
        <router-link :to="`/products/${product.id}`" class="btn-outline-sage w-100 text-center" @click.stop>
          ✏️ Edit
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const store = useStore()
const router = useRouter()
const stores = computed(() => store.getters['products/stores'])
const isLoggedIn = computed(() => !!store.state.auth.token)
const imgError = ref(false)

const goToEdit = () => {
  if (isLoggedIn.value) {
    router.push(`/products/${props.product.id}`)
  }
}

const getStoreName = (storeId) => {
  const s = stores.value.find(st => st.id === storeId)
  return s ? s.name : storeId
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const getDiscountPercent = (price) => {
  if (!price.salePrice || !price.regularPrice) return 0
  return Math.round(((price.regularPrice - price.salePrice) / price.regularPrice) * 100)
}

const maxDiscount = computed(() => {
  if (!props.product.prices?.length) return 0
  return Math.max(...props.product.prices.map(getDiscountPercent))
})

const isBestPrice = (price) => {
  if (!props.product.prices?.length) return false
  const prices = props.product.prices.map(p => p.salePrice || p.regularPrice)
  const minPrice = Math.min(...prices)
  const currentPrice = price.salePrice || price.regularPrice
  return currentPrice === minPrice
}
</script>

<style scoped>
.product-img {
  max-width: 80%;
  max-height: 120px;
  object-fit: contain;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--terracotta);
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 50px;
}

.price-list {
  border-top: 1px solid rgba(59, 47, 47, 0.08);
  padding-top: 0.5rem;
}

.price-item {
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(59, 47, 47, 0.05);
}

.price-item:last-child {
  border-bottom: none;
}

.store-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--espresso-light);
}

.badge-best {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--sage-dark);
  background: rgba(122, 139, 111, 0.15);
  padding: 0.1rem 0.4rem;
  border-radius: 50px;
}

.badge-save {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--terracotta);
  background: rgba(194, 112, 62, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 50px;
}
</style>
