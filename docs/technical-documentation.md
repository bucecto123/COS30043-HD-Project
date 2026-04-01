# Technical Documentation

## Table of Contents
1. [State Management (Vuex)](#state-management-vuex)
2. [Lazy Loading (Pagination)](#lazy-loading-pagination)
3. [SPA Authentication (JWT)](#spa-authentication-jwt)

---

## 1. State Management (Vuex)

### Overview
Vuex is the official state management library for Vue.js applications. It provides a centralized store for all application components.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Vue App                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │   Views      │   │ Components   │   │   Router     │  │
│  │ (Pages)      │   │              │   │              │  │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘  │
│         │                  │                  │            │
│         └──────────────────┼──────────────────┘            │
│                            ▼                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    Vuex Store                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │ │
│  │  │ auth.js     │  │ products.js │  │  (modules)  │ │ │
│  │  │ - user     │  │ - items    │  │             │ │ │
│  │  │ - token    │  │ - loading  │  │             │ │ │
│  │  │ - isAuth   │  │ - filters  │  │             │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
│                            │                               │
│                            ▼                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Backend API (Express.js)                │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Implementation

#### Store Structure (`frontend/src/store/index.js`)

```javascript
import { createStore } from 'vuex'
import auth from './auth'
import products from './products'

export default createStore({
  modules: {
    auth,
    products
  }
})
```

#### Auth Module (`frontend/src/store/auth.js`)

```javascript
// State - reactive data
const state = () => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null
})

// Getters - computed properties from state
const getters = {
  isAuthenticated: (state) => !!state.token,
  user: (state) => state.user,
  isAdmin: (state) => state.user?.role === 'admin'
}

// Mutations - only way to modify state
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
  LOGOUT(state) {
    state.user = null
    state.token = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

// Actions - async operations, commit mutations
const actions = {
  async login({ commit }, { username, password }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    commit('SET_TOKEN', data.token)
    commit('SET_USER', data.user)
    return data
  },

  logout({ commit }) {
    commit('LOGOUT')
  },

  initAuth({ commit }) {
    // Restore session on page refresh
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    if (token && user) {
      commit('SET_TOKEN', token)
      commit('SET_USER', user)
    }
  }
}

export default { namespaced: true, state, getters, mutations, actions }
```

#### Products Module (`frontend/src/store/products.js`)

```javascript
const state = () => ({
  items: [],           // Product list
  currentPage: 0,      // Current pagination page
  hasMore: true,       // Flag for lazy loading
  loading: false,      // Loading state
  error: null,         // Error messages
  stores: [],          // Store list
  filters: {           // Active filters
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
  SET_PRODUCTS(state, products) {      // Replace (reset)
    state.items = products
  },
  APPEND_PRODUCTS(state, products) {   // Append (load more)
    state.items = [...state.items, ...products]
  },
  ADD_PRODUCT(state, product) {
    state.items.unshift(product)
  },
  UPDATE_PRODUCT(state, updated) {
    const index = state.items.findIndex(p => p.id === updated.id)
    if (index !== -1) state.items[index] = updated
  },
  REMOVE_PRODUCT(state, productId) {
    state.items = state.items.filter(p => p.id !== productId)
  },
  SET_CURRENT_PAGE(state, page) { state.currentPage = page },
  SET_HAS_MORE(state, hasMore) { state.hasMore = hasMore },
  SET_LOADING(state, loading) { state.loading = loading },
  SET_ERROR(state, error) { state.error = error },
  SET_STORES(state, stores) { state.stores = stores },
  SET_FILTER(state, { key, value }) { state.filters[key] = value },
  RESET_FILTERS(state) {
    state.filters = { search: '', storeId: null, category: null }
  }
}

const actions = {
  async fetchProducts({ commit, state }, reset = false) {
    if (state.loading) return
    if (!reset && !state.hasMore) return

    commit('SET_LOADING', true)

    const page = reset ? 1 : state.currentPage + 1
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10'
    })

    // Add filters
    if (state.filters.search) params.append('search', state.filters.search)
    if (state.filters.storeId) params.append('storeId', state.filters.storeId)
    if (state.filters.category) params.append('category', state.filters.category)

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
    commit('SET_LOADING', false)
  }
}

export default { namespaced: true, state, getters, mutations, actions }
```

### Vuex Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        COMPONENT                                 │
│                                                                 │
│  this.$store.dispatch('auth/login', credentials)               │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                         ACTION                                  │
│                                                                 │
│  async login({ commit }, { username, password }) {             │
│    const response = await fetch('/api/auth/login', ...)        │
│    const data = await response.json()                          │
│    commit('SET_TOKEN', data.token)  ◄── Call mutation          │
│  }                                                              │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                       MUTATION                                   │
│                                                                 │
│  SET_TOKEN(state, token) {          ◄── Modify state           │
│    state.token = token            │
│    localStorage.setItem('token', token)                         │
│  }                                                              │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                         STATE (Reactive)                         │
│                                                                 │
│  { token: 'eyJhbGci...', user: {...} }                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ All components watching this state auto-update            ││
│  └─────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Lazy Loading (Pagination)

### Overview
Lazy loading loads data incrementally in small chunks (10 items) rather than loading all data at once. This improves initial page load time and reduces server load.

### Backend Implementation

**File:** `backend/routes/products.js`

```javascript
// GET /api/products?page=1&limit=10&search=milk&storeId=store-001&category=Beverages
router.get('/', (req, res) => {
  // 1. Get query parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { search, storeId, category } = req.query;

  // 2. Apply filters to get ALL matching products
  let filtered = [...products];

  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (storeId) {
    filtered = filtered.filter(p =>
      p.prices.some(price => price.storeId === storeId)
    );
  }

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  // 3. Calculate pagination
  const start = (page - 1) * limit;  // Offset: (1-1)*10 = 0
  const end = start + limit;          // End: 0 + 10 = 10
  const paginated = filtered.slice(start, end);  // Get items 0-9

  // 4. Return response with metadata
  res.json({
    data: paginated,                    // The 10 items for this page
    total: filtered.length,             // Total matching products
    page,                               // Current page
    totalPages: Math.ceil(filtered.length / limit),
    hasMore: end < filtered.length      // Are there more pages?
  });
});
```

### Frontend Implementation

**File:** `frontend/src/store/products.js` (action)

```javascript
async fetchProducts({ commit, state }, reset = false) {
  // Prevent duplicate requests
  if (state.loading) return
  if (!reset && !state.hasMore) return  // Stop if no more data

  commit('SET_LOADING', true)

  // Determine page number
  const page = reset ? 1 : state.currentPage + 1

  // Build query string
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '10'
  })

  // Add active filters
  if (state.filters.search) params.append('search', state.filters.search)
  if (state.filters.storeId) params.append('storeId', state.filters.storeId)
  if (state.filters.category) params.append('category', state.filters.category)

  try {
    const response = await fetch(`/api/products?${params}`)
    const data = await response.json()

    // Handle response based on mode
    if (reset) {
      // Reset: Replace all products (new search/filter)
      commit('SET_PRODUCTS', data.data)
      commit('SET_CURRENT_PAGE', 1)
    } else {
      // Load more: Append to existing list
      commit('APPEND_PRODUCTS', data.data)
      commit('SET_CURRENT_PAGE', page)
    }

    // Update hasMore flag
    commit('SET_HAS_MORE', data.hasMore)
  } finally {
    commit('SET_LOADING', false)
  }
}
```

**File:** `frontend/src/components/LoadMore.vue`

```vue
<template>
  <div class="text-center my-4">
    <!-- Load More Button -->
    <v-btn
      v-if="hasMore && !loading"
      color="primary"
      variant="outlined"
      @click="loadMore"
    >
      Load More
    </v-btn>

    <!-- Loading Spinner -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <!-- End of List -->
    <div v-if="!hasMore && !loading">
      No more products to load
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
  // Append next page (reset = false)
  store.dispatch('products/fetchProducts')
}
</script>
```

### Lazy Loading Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                                 │
│                                                                     │
│  1. Page Load                    2. Click "Load More"              │
│  ┌─────────────────────┐        ┌─────────────────────┐           │
│  │ fetchProducts(true) │        │ fetchProducts(false)│           │
│  │       │             │        │       │             │           │
│  │ reset=true          │        │ reset=false        │           │
│  └──────────┬──────────┘        └──────────┬──────────┘           │
└─────────────┼──────────────────────────────┼─────────────────────────┘
              │                              │
              ▼                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API CALLS                                   │
│                                                                     │
│  GET /api/products?page=1&limit=10      GET /api/products?page=2  │
│                                                                     │
│  Returns:                                  Returns:                │
│  { data: [items 0-9],                     { data: [items 10-19],  │
│    hasMore: true }                         hasMore: true }         │
└─────────────────────────────────────────────────────────────────────┘
              │                              │
              ▼                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      STATE UPDATE                                   │
│                                                                     │
│  SET_PRODUCTS([items 0-9])           APPEND_PRODUCTS([items 10-19])│
│  currentPage = 1                     currentPage = 2              │
│  hasMore = true                      hasMore = true               │
│                                                                     │
│  After: items = [0-9]                After: items = [0-19]        │
└─────────────────────────────────────────────────────────────────────┘
              │                              │
              ▼                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         UI RENDER                                   │
│                                                                     │
│  ┌────┬────┬────┬────┬────┐            ┌────┬────┬────┬────┬────┐ │
│  │ P1 │ P2 │ P3 │ P4 │ P5 │   +       │ P6 │ P7 │ P8 │ P9 │P10 │ │
│  └────┴────┴────┴────┴────┘            └────┴────┴────┴────┴────┘ │
│                                                                     │
│              [Load More Button]                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. SPA Authentication (JWT)

### Overview
JWT (JSON Web Token) is a compact, URL-safe token format for securely transmitting information between parties. In this SPA application, JWT provides stateless authentication.

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     1. USER REGISTRATION                           │
│                                                                     │
│  ┌──────────┐    POST /api/auth/register    ┌──────────────┐       │
│  │  Client  │ ──────────────────────────▶  │    Backend   │       │
│  │          │  { username, password }      │              │       │
│  │          │ ◀──────────────────────────── │ 1. Validate │       │
│  │          │  { token, user }             │ 2. Create   │       │
│  └──────────┘                              │ 3. Sign JWT │       │
│                                              └──────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     2. USER LOGIN                                  │
│                                                                     │
│  ┌──────────┐    POST /api/auth/login      ┌──────────────┐       │
│  │  Client  │ ──────────────────────────▶  │    Backend   │       │
│  │          │  { username, password }      │              │       │
│  │          │ ◀──────────────────────────── │ 1. Find user│       │
│  │          │  { token, user }             │ 2. Verify   │       │
│  └──────────┘                              │ 3. Sign JWT │       │
│                                              └──────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 3. TOKEN STORAGE (Client)                         │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  localStorage                                                │  │
│  │  ┌────────────────────┐  ┌─────────────────────────────┐   │  │
│  │  │ token: "eyJhbGc..."│  │ user: { id, username, role }│   │  │
│  │  └────────────────────┘  └─────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│            4. PROTECTED API REQUESTS                               │
│                                                                     │
│  ┌──────────┐    GET /api/products         ┌──────────────┐        │
│  │  Client  │ ──────────────────────────▶  │    Backend   │        │
│  │          │  Authorization: Bearer eyJ...│              │        │
│  │          │ ◀──────────────────────────── │ 1. Extract  │        │
│  │          │  { data: [...] }             │ 2. Verify   │        │
│  └──────────┘                              │ 3. Return   │        │
│                                              └──────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 5. ROUTE PROTECTION (Frontend)                    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Router Guard (beforeEach)                                  │  │
│  │                                                             │  │
│  │  if (requiresAuth && !isAuthenticated)                      │  │
│  │      redirect('/login')                                     │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### JWT Token Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                    JWT TOKEN (Header.Payload.Signature)            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9                              │
│  .                                                                │
│  eyJpZCI6InVzZXItMDAxIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1p │
│  biIsImlhdCI6MTc3MzY1MTYxMSwiZXhwIjoxNzczNzM4MDExfQ              │
│  .                                                                │
│  1zfhoMwikEbo3J6f9xAgeia8d0XImq1sQLXtt2Z9kOE                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  HEADER:  { "alg": "HS256", "typ": "JWT" }                        │
│  PAYLOAD: { "id": "user-001", "username": "admin",                │
│             "role": "admin", "iat": 1773651611,                    │
│             "exp": 1773738011 }                                    │
│  SIGNATURE: HMAC-SHA256(secretKey, header.payload)                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Backend Implementation

**File:** `backend/routes/auth.js`

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const SECRET_KEY = 'danang-price-compare-secret-key';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 1. Validate credentials
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // 2. Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: '24h' }  // Token expires in 24 hours
  );

  // 3. Return token and user info
  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // 1. Validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  // 2. Check if user exists
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // 3. Create new user
  const newUser = {
    id: `user-${String(users.length + 1).padStart(3, '0')}`,
    username,
    password,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  // 4. Save to database
  users.push(newUser);
  fs.writeFileSync(path.join(__dirname, '../data/users.json'),
    JSON.stringify(users, null, 2));

  // 5. Generate JWT
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, role: newUser.role },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    token,
    user: { id: newUser.id, username: newUser.username, role: newUser.role }
  });
});
```

### Authentication Middleware

**File:** `backend/routes/products.js`

```javascript
// Middleware to protect routes
const authenticate = (req, res, next) => {
  // 1. Check for token in header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // 2. Extract token (Bearer <token>)
  const jwt = require('jsonwebtoken');
  const SECRET_KEY = 'danang-price-compare-secret-key';

  try {
    // 3. Verify token
    const decoded = jwt.verify(authHeader.split(' ')[1], SECRET_KEY);
    req.user = decoded;  // Attach user to request
    next();              // Continue to route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route example
router.post('/', authenticate, (req, res) => {
  // Only authenticated users can reach here
  const newProduct = { ...req.body, id: uuidv4() };
  products.push(newProduct);
  res.status(201).json(newProduct);
});
```

### Frontend Implementation

**File:** `frontend/src/store/auth.js` (actions)

```javascript
const actions = {
  async login({ commit }, { username, password }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();

    // Store token and user in state AND localStorage
    commit('SET_TOKEN', data.token);
    commit('SET_USER', data.user);

    return data;
  },

  logout({ commit }) {
    commit('LOGOUT');  // Clears state and localStorage
  },

  // Restore session on page refresh
  initAuth({ commit }) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
    }
  }
}
```

### Vue Router Auth Guards

**File:** `frontend/src/router/index.js`

```javascript
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true }  // Mark as protected
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Route guard - runs before every route change
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Not logged in - redirect to login
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    // Already logged in - redirect to products
    next('/products');
  } else {
    next();  // Allow navigation
  }
});
```

### Protected API Call (Frontend)

```javascript
// Creating a product (requires auth)
async createProduct(productData) {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Attach JWT
    },
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return await response.json();
}
```

---

## Summary

| Concept | Technology | Files |
|---------|-----------|-------|
| State Management | Vuex 4 | `frontend/src/store/auth.js`, `products.js` |
| Lazy Loading | Offset Pagination | `backend/routes/products.js`, `frontend/src/store/products.js` |
| Authentication | JWT | `backend/routes/auth.js`, `frontend/src/router/index.js` |
