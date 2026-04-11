// frontend/src/store/products.js
// Products store using Axios for API calls

import { productsApi, storesApi } from '../services/api'

const PRICE_OVERRIDES_KEY = 'productPriceOverrides'

function loadOverrides() {
  try { return JSON.parse(localStorage.getItem(PRICE_OVERRIDES_KEY) || '{}') } catch { return {} }
}

function saveOverrides(overrides) {
  localStorage.setItem(PRICE_OVERRIDES_KEY, JSON.stringify(overrides))
}

function applyOverrides(products, overrides) {
  return products.map(product => {
    const po = overrides[product.id]
    if (!po) return product
    return {
      ...product,
      prices: product.prices.map(price => {
        const o = po[price.storeId]
        return o ? { ...price, ...o } : price
      })
    }
  })
}

const state = () => ({
  items: [],
  localProducts: [],   // admin-created products, survive Supabase re-fetches
  localPriceOverrides: loadOverrides(),
  currentPage: 0,
  hasMore: true,
  loading: false,
  error: null,
  stores: [],
  filters: {
    search: '',
    storeId: null,
    category: null
  }
})

const getters = {
  allProducts: (state) => state.items,
  isLoading: (state) => state.loading,
  hasMore: (state) => state.hasMore,
  stores: (state) => state.stores,
  filters: (state) => state.filters
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.items = [...state.localProducts, ...applyOverrides(products, state.localPriceOverrides)]
  },
  APPEND_PRODUCTS(state, products) {
    state.items = [...state.localProducts, ...state.items.filter(p => !p._local), ...applyOverrides(products, state.localPriceOverrides)]
  },
  SET_LOCAL_PRICE(state, { productId, storeId, regularPrice, salePrice }) {
    if (!state.localPriceOverrides[productId]) state.localPriceOverrides[productId] = {}
    state.localPriceOverrides[productId][storeId] = { regularPrice, salePrice }
    saveOverrides(state.localPriceOverrides)
    const product = state.items.find(p => p.id === productId)
    if (product) {
      const idx = product.prices.findIndex(p => p.storeId === storeId)
      if (idx !== -1) product.prices.splice(idx, 1, { ...product.prices[idx], regularPrice, salePrice })
    }
  },
  ADD_PRODUCT(state, product) {
    const p = { ...product, _local: true }
    state.localProducts.unshift(p)
    state.items.unshift(p)
  },
  UPDATE_PRODUCT(state, updated) {
    const index = state.items.findIndex(p => p.id === updated.id)
    if (index !== -1) {
      state.items[index] = updated
    }
  },
  REMOVE_PRODUCT(state, productId) {
    state.items = state.items.filter(p => p.id !== productId)
    state.localProducts = state.localProducts.filter(p => p.id !== productId)
  },
  SET_CURRENT_PAGE(state, page) {
    state.currentPage = page
  },
  SET_HAS_MORE(state, hasMore) {
    state.hasMore = hasMore
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_STORES(state, stores) {
    state.stores = stores
  },
  SET_FILTER(state, { key, value }) {
    state.filters[key] = value
  },
  RESET_FILTERS(state) {
    state.filters = { search: '', storeId: null, category: null }
  }
}

const actions = {
  async fetchStores({ commit }) {
    try {
      const data = await storesApi.getAll()
      commit('SET_STORES', data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    }
  },

  async fetchProducts({ commit, state }, reset = false) {
    if (state.loading) return
    if (!reset && !state.hasMore) return

    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    const page = reset ? 1 : state.currentPage + 1
    const params = {
      page,
      limit: 10
    }

    if (state.filters.search) {
      params.search = state.filters.search
    }
    if (state.filters.storeId) {
      params.storeId = state.filters.storeId
    }
    if (state.filters.category) {
      params.category = state.filters.category
    }

    try {
      const data = await productsApi.getAll(params)

      if (reset) {
        commit('SET_PRODUCTS', data.data)
        commit('SET_CURRENT_PAGE', 1)
      } else {
        commit('APPEND_PRODUCTS', data.data)
        commit('SET_CURRENT_PAGE', page)
      }

      commit('SET_HAS_MORE', data.hasMore)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createProduct({ commit }, productData) {
    try {
      const product = await productsApi.create(productData)
      commit('ADD_PRODUCT', product)
      return product
    } catch (_) {
      // Filesystem read-only on Vercel — add to UI state only
      const product = { ...productData, id: `local-${Date.now()}` }
      commit('ADD_PRODUCT', product)
      return product
    }
  },

  async updateProduct({ commit }, { id, ...productData }) {
    try {
      const product = await productsApi.update(id, productData)
      commit('UPDATE_PRODUCT', product)
      return product
    } catch (_) {
      // Filesystem read-only on Vercel — update UI state only
      const product = { id, ...productData }
      commit('UPDATE_PRODUCT', product)
      return product
    }
  },

  async deleteProduct({ commit }, productId) {
    try {
      await productsApi.delete(productId)
    } catch (_) {
      // Best-effort — always remove from UI state
    }
    commit('REMOVE_PRODUCT', productId)
  },

  setLocalPrice({ commit }, payload) {
    commit('SET_LOCAL_PRICE', payload)
  },

  setFilter({ commit }, { key, value }) {
    commit('SET_FILTER', { key, value })
  },

  resetFilters({ commit }) {
    commit('RESET_FILTERS')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
