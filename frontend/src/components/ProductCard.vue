<template>
  <div class="product-card h-100" :class="{ 'card-selected': selected }">
    <div class="card-img-wrap">
      <img v-if="product.image && !imgError" :src="product.image" :alt="product.name" @error="imgError = true" class="product-img" />
      <span v-else class="product-emoji">🛒</span>
      <div v-if="maxDiscount > 0" class="discount-badge">
        -{{ maxDiscount }}%
      </div>
      <!-- Like button -->
      <button
        class="like-btn"
        :class="{ liked: isLiked }"
        @click.stop="toggleLike"
        v-tooltip="isLiked ? 'Remove from favorites' : 'Add to favorites'"
        :aria-label="isLiked ? 'Remove from favorites' : 'Add to favorites'"
        :aria-pressed="isLiked"
      >
        {{ isLiked ? '❤️' : '🤍' }}
        <span class="like-count">{{ likeCount }}</span>
      </button>
      <!-- compare button goes here -->
       <button
       class="compare-btn"
       :class="{'compare-active':selected}"
       @click.stop="comparison.toggleProduct(product)"
       :aria-label="selected ? 'Remove from comparison' : 'Add to comparison'"
       :aria-pressed="selected"
       >{{ selected ? '✓' : '+' }}</button>
    </div>

    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <span class="store-tag">📦 {{ product.brand || 'Various' }}</span>
        <button v-if="isAdmin" class="delete-btn" @click.stop="confirmDelete" title="Delete product">🗑️</button>
      </div>
      <div class="product-name">{{ product.name }}</div>
      <div class="text-espresso-light" style="font-size: 0.8rem;">{{ product.unit }}</div>

      <div class="price-list mt-2">
        <div v-for="price in product.prices" :key="price.storeId" class="price-item">
          <!-- Edit mode -->
          <template v-if="editingPrice?.storeId === price.storeId">
            <div class="price-edit-form">
              <span class="store-name mb-1">{{ getStoreName(price.storeId) }}</span>
              <input
                v-model.number="editingPrice.regularPrice"
                type="number"
                class="price-input"
                placeholder="Regular price"
              />
              <input
                v-model.number="editingPrice.salePrice"
                type="number"
                class="price-input"
                placeholder="Sale price (optional)"
              />
              <div class="edit-actions">
                <button class="edit-save-btn" @click.stop="saveEdit">✓ Save</button>
                <button class="edit-cancel-btn" @click.stop="cancelEdit">✕</button>
              </div>
            </div>
          </template>
          <!-- Display mode -->
          <template v-else>
            <div class="d-flex justify-content-between align-items-center">
              <span class="store-name">{{ getStoreName(price.storeId) }}</span>
              <div class="d-flex align-items-center gap-1">
                <div class="text-end">
                  <span class="product-price" :class="{ 'on-sale': price.salePrice }">{{ formatPrice(price.salePrice || price.regularPrice) }}</span>
                  <span v-if="price.salePrice" class="old-price">{{ formatPrice(price.regularPrice) }}</span>
                </div>
                <button v-if="isAdmin" class="edit-price-btn" @click.stop="startEdit(price)" title="Edit price locally">✏️</button>
              </div>
            </div>
            <div class="d-flex gap-1 mt-1 flex-wrap">
              <span v-if="isBestPrice(price)" class="badge-best">🏆 Best</span>
              <span v-if="getDiscountPercent(price) > 0" class="badge-save">-{{ getDiscountPercent(price) }}%</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, inject } from 'vue'  // add inject
import { useStore } from 'vuex'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const store = useStore()
const stores = computed(() => store.getters['products/stores'])
const isAdmin = computed(() => store.getters['auth/isAdmin'])
const imgError = ref(false)

const comparison = inject('comparison')
const selected = computed(() => comparison.isSelected(props.product.id))

// Local price editing
const editingPrice = ref(null)

function startEdit(price) {
  editingPrice.value = { storeId: price.storeId, regularPrice: price.regularPrice, salePrice: price.salePrice }
}

function saveEdit() {
  store.dispatch('products/setLocalPrice', {
    productId: props.product.id,
    ...editingPrice.value
  })
  editingPrice.value = null
}

function cancelEdit() {
  editingPrice.value = null
}

async function confirmDelete() {
  if (!confirm(`Delete "${props.product.name}"? This cannot be undone.`)) return
  await store.dispatch('products/deleteProduct', props.product.id)
}

// Like functionality
const isLiked = ref(false)
const likeCount = ref(0)

// Load likes from localStorage
onMounted(() => {
  const likes = JSON.parse(localStorage.getItem('productLikes') || '{}')
  isLiked.value = likes[props.product.id]?.liked || false
  likeCount.value = likes[props.product.id]?.count || Math.floor(Math.random() * 50) + 5
})

const toggleLike = () => {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
  
  // Save to localStorage
  const likes = JSON.parse(localStorage.getItem('productLikes') || '{}')
  likes[props.product.id] = {
    liked: isLiked.value,
    count: likeCount.value
  }
  localStorage.setItem('productLikes', JSON.stringify(likes))
}

const getStoreName = (storeId) => {
  const s = stores.value.find(st => st.id === storeId)
  return s ? s.name : storeId
}

const vndFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
const formatPrice = (price) => vndFormatter.format(price)

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

.like-btn {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.like-btn:hover {
  transform: scale(1.05);
}

.like-btn.liked {
  background: rgba(255, 100, 100, 0.15);
}

.like-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--espresso-light);
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

.product-price {
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--espresso);
}
.product-price.on-sale {
  color: #d0341a;
}
.old-price {
  display: block;
  font-size: 0.75rem;
  color: var(--espresso-light);
  text-decoration: line-through;
  opacity: 0.7;
}

.edit-price-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.4;
  padding: 0.1rem 0.2rem;
  transition: opacity 0.2s;
}
.edit-price-btn:hover { opacity: 1; }

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  opacity: 0.35;
  padding: 0.1rem 0.2rem;
  transition: opacity 0.2s;
  line-height: 1;
}
.delete-btn:hover { opacity: 1; }

.price-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.3rem 0;
}
.price-input {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgba(122,139,111,0.4);
  border-radius: var(--radius-sm, 6px);
  width: 100%;
}
.edit-actions { display: flex; gap: 0.4rem; }
.edit-save-btn {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
}
.edit-cancel-btn {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: none;
  border: 1px solid rgba(59,47,47,0.2);
  border-radius: 50px;
  cursor: pointer;
  color: var(--espresso-light);
}

/* .compare-btn, .compare-btn.compare-active, .card-selected */
.compare-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--sage);
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.compare-btn.compare-active { background: var(--sage); color: white; }
.card-selected { border: 2px solid var(--sage); box-shadow: 0 0 0 2px rgba(107,143,94,0.3); }
</style>
