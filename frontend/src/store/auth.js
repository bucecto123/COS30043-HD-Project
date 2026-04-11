// frontend/src/store/auth.js
// Production-ready authentication store with Axios

import { authApi } from '../services/api'

const state = () => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: false
})

const getters = {
  isAuthenticated: (state) => !!state.token && !!state.user,
  user: (state) => state.user,
  token: (state) => state.token,
  isAdmin: (state) => state.user?.role === 'admin',
  isLoading: (state) => state.loading,
  error: (state) => state.error,
  isInitialized: (state) => state.initialized
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },

  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  CLEAR_ERROR(state) {
    state.error = null
  },

  SET_INITIALIZED(state, initialized) {
    state.initialized = initialized
  },

  LOGOUT(state) {
    state.user = null
    state.token = null
    state.error = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

const actions = {
  // Initialize auth state from localStorage
  async initAuth({ commit }) {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
      } catch (e) {
        // Invalid stored data, clear it
        commit('LOGOUT')
      }
    }

    commit('SET_INITIALIZED', true)
  },

  // Login action using Axios
  async login({ commit }, { username, password }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      const data = await authApi.login(username, password)

      if (!data || !data.token || !data.user) {
        throw new Error('Invalid response from server')
      }

      commit('SET_TOKEN', data.token)
      commit('SET_USER', data.user)

      return data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Register action using Axios
  async register({ commit }, { username, password }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      const data = await authApi.register(username, password)

      if (!data || !data.token || !data.user) {
        throw new Error('Invalid response from server')
      }

      commit('SET_TOKEN', data.token)
      commit('SET_USER', data.user)

      return data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Logout action
  logout({ commit }) {
    commit('LOGOUT')
  },

  // Clear error
  clearError({ commit }) {
    commit('CLEAR_ERROR')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
