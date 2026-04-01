// frontend/src/store/products.js

const state = () => ({
  items: [],
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
    state.items = products
  },
  APPEND_PRODUCTS(state, products) {
    state.items = [...state.items, ...products]
  },
  ADD_PRODUCT(state, product) {
    state.items.unshift(product)
  },
  UPDATE_PRODUCT(state, updated) {
    const index = state.items.findIndex(p => p.id === updated.id)
    if (index !== -1) {
      state.items[index] = updated
    }
  },
  REMOVE_PRODUCT(state, productId) {
    state.items = state.items.filter(p => p.id !== productId)
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
      const response = await fetch('/api/stores')
      const data = await response.json()
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
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10'
    })

    if (state.filters.search) {
      params.append('search', state.filters.search)
    }
    if (state.filters.storeId) {
      params.append('storeId', state.filters.storeId)
    }
    if (state.filters.category) {
      params.append('category', state.filters.category)
    }

    try {
      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

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
    const token = localStorage.getItem('token')
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    })

    if (!response.ok) {
      throw new Error('Failed to create product')
    }

    const product = await response.json()
    commit('ADD_PRODUCT', product)
    return product
  },

  async updateProduct({ commit }, { id, ...productData }) {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    })

    if (!response.ok) {
      throw new Error('Failed to update product')
    }

    const product = await response.json()
    commit('UPDATE_PRODUCT', product)
    return product
  },

  async deleteProduct({ commit }, productId) {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to delete product')
    }

    commit('REMOVE_PRODUCT', productId)
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
