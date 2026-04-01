// frontend/src/store/api.js
// Centralized API service with authentication handling

const API_BASE = '/api'

class ApiService {
  constructor() {
    this.baseUrl = API_BASE
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token')
  }

  // Build headers with optional auth
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    }

    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  // Parse response and handle errors
  async handleResponse(response) {
    // Handle empty responses
    const text = await response.text()

    if (!text) {
      if (response.ok) {
        return null
      }
      throw new Error('Empty response from server')
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      throw new Error('Invalid JSON response from server')
    }

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401) {
        // Token expired or invalid - clear auth state
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.dispatchEvent(new CustomEvent('auth:expired'))
      }

      throw new Error(data.message || `Request failed with status ${response.status}`)
    }

    return data
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(options.auth !== false),
        ...options.headers
      }
    }

    try {
      const response = await fetch(url, config)
      return await this.handleResponse(response)
    } catch (error) {
      // Network errors
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check if the backend is running.')
      }
      throw error
    }
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  // Auth-specific methods (no auth header needed)
  async login(username, password) {
    return this.post('/auth/login', { username, password }, { auth: false })
  }

  async register(username, password) {
    return this.post('/auth/register', { username, password }, { auth: false })
  }
}

// Export singleton instance
const api = new ApiService()
export default api
