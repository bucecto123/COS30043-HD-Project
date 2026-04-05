<template>
  <div class="page-enter">
    <!-- Header -->
    <div class="bloom-nav">
      <div class="container d-flex align-items-center gap-3 py-2">
        <button class="nav-icon-btn" @click="goBack">←</button>
        <span class="navbar-brand mb-0">
          {{ isEditMode ? '✏️ Edit Product' : '➕ New Product' }}
        </span>
      </div>
    </div>

    <div class="container py-4">
      <div class="row">
        <!-- Form Column -->
        <div class="col-12 col-lg-8">
          <!-- Basics Card -->
          <div class="form-card mb-4">
            <h5 class="form-card-title">📦 Basic Information</h5>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="bloom-label">Product Name *</label>
                <input
                  type="text"
                  class="bloom-input"
                  v-model="product.name"
                  placeholder="e.g., Coca-Cola Zero"
                  required
                >
              </div>
              <div class="col-12 col-md-6">
                <label class="bloom-label">Brand *</label>
                <input
                  type="text"
                  class="bloom-input"
                  v-model="product.brand"
                  placeholder="e.g., Coca-Cola"
                  required
                >
              </div>
              <div class="col-12 col-md-6">
                <label class="bloom-label">Category *</label>
                <select class="bloom-select" v-model="product.category" required>
                  <option value="" disabled>Select category</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="bloom-label">Unit *</label>
                <input
                  type="text"
                  class="bloom-input"
                  v-model="product.unit"
                  placeholder="e.g., 330ml, 1kg, pack of 6"
                  required
                >
              </div>
              <div class="col-12">
                <label class="bloom-label">Image URL (optional)</label>
                <input
                  type="url"
                  class="bloom-input"
                  v-model="product.image"
                  placeholder="https://..."
                >
              </div>
            </div>
          </div>

          <!-- Pricing Card -->
          <div class="form-card">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="form-card-title mb-0">💰 Store Prices</h5>
              <button type="button" class="btn-outline-sage" @click="addPrice">
                + Add Store
              </button>
            </div>

            <div v-for="(price, index) in product.prices" :key="index" class="price-row">
              <div class="row g-2 align-items-end">
                <div class="col-12 col-md-4">
                  <label class="bloom-label">Store *</label>
                  <select class="bloom-select" v-model="price.storeId" required>
                    <option value="" disabled>Select store</option>
                    <option v-for="s in stores" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
                <div class="col-6 col-md-3">
                  <label class="bloom-label">Regular Price *</label>
                  <input
                    type="number"
                    class="bloom-input"
                    v-model.number="price.regularPrice"
                    placeholder="₫"
                    required
                  >
                </div>
                <div class="col-6 col-md-3">
                  <label class="bloom-label">Sale Price</label>
                  <input
                    type="number"
                    class="bloom-input"
                    v-model.number="price.salePrice"
                    placeholder="₫ (optional)"
                  >
                </div>
                <div class="col-12 col-md-2 d-flex align-items-center">
                  <button
                    type="button"
                    class="btn-delete"
                    @click="removePrice(index)"
                    :disabled="product.prices.length <= 1"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Column -->
        <div class="col-12 col-lg-4 mt-4 mt-lg-0">
          <div class="preview-card">
            <h6 class="form-card-title">👁️ Preview</h6>
            <div class="preview-image">
              <img
                v-if="product.image"
                :src="product.image"
                alt="Preview"
                @error="imgError = true"
                v-show="!imgError"
              >
              <span v-if="!product.image || imgError" class="preview-emoji">🛒</span>
            </div>
            <div class="preview-body">
              <div class="product-name">{{ product.name || 'Product name' }}</div>
              <div class="text-espresso-light" style="font-size: 0.85rem;">
                {{ product.brand || 'Brand' }} • {{ product.unit || 'Unit' }}
              </div>
              <span class="preview-badge mt-2">📝 Draft</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="bloom-alert bloom-alert-error mt-4">
        {{ error }}
      </div>
    </div>

    <!-- Sticky Actions -->
    <div class="sticky-actions">
      <div class="container py-3 d-flex gap-2 justify-content-end">
        <button
          class="btn-sage"
          :disabled="!isValid || saving"
          @click="saveProduct"
        >
          {{ saving ? '●●●' : (isEditMode ? '💾 Update Product' : '✓ Create Product') }}
        </button>
        <button
          v-if="isEditMode"
          class="btn-delete-outline"
          :disabled="deleting"
          @click="confirmDelete"
        >
          {{ deleting ? '●●●' : '🗑️ Delete' }}
        </button>
        <button class="btn-outline-sage" @click="goBack">Cancel</button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteDialog" class="bloom-modal-overlay" @click="deleteDialog = false">
      <div class="bloom-modal" @click.stop>
        <div style="font-size: 3rem; margin-bottom: 0.8rem;">⚠️</div>
        <h4 style="font-family: var(--font-display); margin-bottom: 0.3rem;">Delete Product?</h4>
        <p style="color: var(--espresso-light); font-size: 0.9rem; margin-bottom: 1.5rem;">
          Are you sure you want to delete "{{ product.name }}"? This cannot be undone.
        </p>
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn-outline-sage" @click="deleteDialog = false">Cancel</button>
          <button class="btn-delete-outline" @click="deleteProduct">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
const router = useRouter()
const route = useRoute()

const saving = ref(false)
const deleting = ref(false)
const error = ref('')
const deleteDialog = ref(false)
const imgError = ref(false)

const product = ref({
  id: null,
  name: '',
  brand: '',
  category: '',
  unit: '',
  image: '',
  prices: [
    { storeId: '', regularPrice: null, salePrice: null }
  ]
})

const categories = [
  'Beverages',
  'Snacks',
  'Dairy',
  'Rice & Noodles',
  'Canned Goods',
  'Condiments',
  'Frozen Foods',
  'Personal Care',
  'Household',
  'Others'
]

const stores = computed(() => store.getters['products/stores'])
const isEditMode = computed(() => !!route.params.id)

const isValid = computed(() => {
  return product.value.name &&
         product.value.brand &&
         product.value.category &&
         product.value.unit &&
         product.value.prices.some(p => p.storeId && p.regularPrice > 0)
})

const addPrice = () => {
  product.value.prices.push({ storeId: '', regularPrice: null, salePrice: null })
}

const removePrice = (index) => {
  product.value.prices.splice(index, 1)
}

const goBack = () => {
  router.push('/products')
}

const saveProduct = async () => {
  if (!isValid.value) return

  saving.value = true
  error.value = ''

  try {
    const cleanedPrices = product.value.prices
      .filter(p => p.storeId && p.regularPrice)
      .map(p => ({
        storeId: p.storeId,
        regularPrice: p.regularPrice,
        salePrice: p.salePrice || null
      }))

    const productData = {
      ...product.value,
      prices: cleanedPrices
    }

    if (isEditMode.value) {
      await store.dispatch('products/updateProduct', {
        id: product.value.id,
        ...productData
      })
    } else {
      await store.dispatch('products/createProduct', productData)
    }

    router.push('/products')
  } catch (err) {
    error.value = err.message || 'Failed to save product'
  } finally {
    saving.value = false
  }
}

const confirmDelete = () => {
  deleteDialog.value = true
}

const deleteProduct = async () => {
  deleting.value = true
  deleteDialog.value = false

  try {
    await store.dispatch('products/deleteProduct', product.value.id)
    router.push('/products')
  } catch (err) {
    error.value = err.message || 'Failed to delete product'
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  if (stores.value.length === 0) {
    await store.dispatch('products/fetchStores')
  }

  if (isEditMode.value) {
    try {
      const { productsApi } = await import('../store/api')
      const data = await productsApi.getById(route.params.id)
      product.value = data
    } catch (err) {
      error.value = 'Product not found'
      router.push('/products')
    }
  }
})
</script>

<style scoped>
.form-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid rgba(122, 139, 111, 0.1);
}

.form-card-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.price-row {
  padding: 1rem 0;
  border-bottom: 1px solid rgba(59, 47, 47, 0.08);
}

.price-row:last-child {
  border-bottom: none;
}

.btn-delete {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-delete:hover:not(:disabled) {
  opacity: 1;
}

.btn-delete:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-delete-outline {
  background: transparent;
  color: var(--tomato);
  border: 1.5px solid var(--tomato);
  border-radius: 50px;
  padding: 0.55rem 1.4rem;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-delete-outline:hover {
  background: var(--tomato);
  color: white;
}

.preview-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid rgba(122, 139, 111, 0.1);
  position: sticky;
  top: 80px;
}

.preview-image {
  background: linear-gradient(135deg, #faf5ed, #f0ebe0);
  border-radius: var(--radius-md);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;
}

.preview-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-emoji {
  font-size: 4rem;
}

.preview-body {
  text-align: center;
}

.preview-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: rgba(122, 139, 111, 0.1);
  color: var(--sage-dark);
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
}

.sticky-actions {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: rgba(255, 248, 240, 0.95);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(122, 139, 111, 0.1);
}
</style>
