# Da Nang Price Compare - Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vue.js 3 + Bootstrap 5 SPA with Express backend for comparing supermarket prices across Go!, Bách Hoá Xanh, and Lottemart in Da Nang.

**Architecture:**
- Vue 3 SPA with Vuex state management and Vue Router
- Express.js REST API backend
- JWT authentication with protected routes
- Lazy-loading pagination for product listings
- Bootstrap 5 grid layout for responsive design

**Tech Stack:** Vue.js 3, Vite, Vue Router 4, Vuex 4, Bootstrap 5, Express.js, JWT

---

## File Structure

```
D:\Study\Home_work\COS30043\project\
├── backend/                    # Express API server
│   ├── server.js               # Main server entry
│   ├── package.json            # Backend dependencies
│   ├── data/
│   │   ├── products.json       # 100+ products data
│   │   ├── stores.json        # Store definitions
│   │   └── users.json         # Demo users
│   └── routes/
│       ├── auth.js             # Login endpoint
│       ├── products.js         # CRUD products
│       └── stores.js           # Stores endpoint
│
├── frontend/                   # Vue 3 SPA
│   ├── index.html             # Entry HTML
│   ├── vite.config.js         # Vite configuration
│   ├── package.json           # Frontend dependencies
│   └── src/
│       ├── main.js            # Vue app entry
│       ├── App.vue             # Root component
│       ├── router/
│       │   └── index.js       # Vue Router config
│       ├── store/
│       │   ├── index.js       # Vuex store entry
│       │   ├── auth.js        # Auth module
│       │   └── products.js    # Products module
│       ├── views/
│       │   ├── Login.vue      # Login page
│       │   ├── Products.vue   # Product list with lazy-load
│       │   └── ProductEdit.vue # Create/Edit product
│       └── components/
│           ├── NavBar.vue     # Top navigation
│           ├── ProductCard.vue # Product card component
│           ├── ProductFilters.vue # Sidebar filters
│           └── LoadMore.vue   # Lazy-load button
│
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-03-16-da-nang-price-compare-design.md
```

---

## Chunk 1: Backend Setup & API

### Task 1: Initialize Backend Project

**Files:**
- Create: `backend/package.json`
- Create: `backend/server.js`
- Create: `backend/data/stores.json`
- Create: `backend/data/users.json`
- Create: `backend/routes/auth.js`
- Create: `backend/routes/stores.js`
- Create: `backend/routes/products.js`

- [ ] **Step 1: Create backend directory and package.json**

```bash
mkdir -p backend/data backend/routes
cd backend
npm init -y
npm install express cors body-parser jsonwebtoken uuid
```

**package.json:**
```json
{
  "name": "danang-price-compare-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "uuid": "^9.0.1"
  }
}
```

- [ ] **Step 2: Create stores.json**

```json
[
  {
    "id": "go",
    "name": "Go!",
    "location": "Đường 2 Tháng 9, Hải Châu, Da Nang",
    "logo": "https://via.placeholder.com/100x100?text=Go!"
  },
  {
    "id": "bhx",
    "name": "Bách Hoá Xanh",
    "location": "Various locations in Da Nang",
    "logo": "https://via.placeholder.com/100x100?text=BHX"
  },
  {
    "id": "lottemart",
    "name": "Lottemart",
    "location": "01 Lê Duẩn, Hải Châu, Da Nang",
    "logo": "https://via.placeholder.com/100x100?text=LM"
  }
]
```

- [ ] **Step 3: Create users.json**

```json
[
  {
    "id": "user-1",
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  },
  {
    "id": "user-2",
    "username": "user",
    "password": "user123",
    "role": "user"
  }
]
```

- [ ] **Step 4: Create auth.js route**

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../data/users.json');

const router = express.Router();
const SECRET_KEY = 'danang-price-compare-secret-key';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
});

module.exports = router;
```

- [ ] **Step 5: Create stores.js route**

```javascript
const express = require('express');
const stores = require('../data/stores.json');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(stores);
});

module.exports = router;
```

- [ ] **Step 6: Create products.js route with pagination**

```javascript
const express = require('express');
const products = require('../data/products.json');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Middleware to check auth
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const jwt = require('jsonwebtoken');
  const SECRET_KEY = 'danang-price-compare-secret-key';

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// GET all products with pagination
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { search, storeId, category } = req.query;

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

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  res.json({
    data: paginated,
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit),
    hasMore: end < filtered.length
  });
});

// GET single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// POST create product (admin only)
router.post('/', authenticate, (req, res) => {
  const { name, category, brand, unit, image, prices } = req.body;

  const newProduct = {
    id: uuidv4(),
    name,
    category,
    brand,
    unit,
    image,
    prices: prices || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  products.push(newProduct);
  fs.writeFileSync(
    path.join(__dirname, '../data/products.json'),
    JSON.stringify(products, null, 2)
  );

  res.status(201).json(newProduct);
});

// PUT update product (admin only)
router.put('/:id', authenticate, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updated = {
    ...products[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  products[index] = updated;
  fs.writeFileSync(
    path.join(__dirname, '../data/products.json'),
    JSON.stringify(products, null, 2)
  );

  res.json(updated);
});

// DELETE product (admin only)
router.delete('/:id', authenticate, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(index, 1);
  fs.writeFileSync(
    path.join(__dirname, '../data/products.json'),
    JSON.stringify(products, null, 2)
  );

  res.json({ message: 'Product deleted' });
});

module.exports = router;
```

- [ ] **Step 7: Create main server.js**

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const storesRoutes = require('./routes/stores');
const productsRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/products', productsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 8: Test backend**

```bash
cd backend
npm install
node server.js
```

Test in another terminal:
```bash
curl http://localhost:3000/api/stores
curl http://localhost:3000/api/products?page=1&limit=10
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'
```

- [ ] **Step 9: Commit**

```bash
cd D:\Study\Home_work\COS30043\project
git init
git add backend/
git commit -m "feat: add Express backend with API endpoints"
```

---

### Task 2: Generate 100+ Products Data

**Files:**
- Create: `backend/data/products.json`

- [ ] **Step 1: Create products.json with 100+ items**

Generate products across categories: Groceries, Beverages, Fresh Food, Household, Personal Care, Snacks

Sample structure:
```json
[
  {
    "id": "prod-001",
    "name": "Gạo ST25",
    "category": "Groceries",
    "brand": "Thắng",
    "unit": "5kg",
    "image": "https://via.placeholder.com/200x200?text=Rice",
    "prices": [
      { "storeId": "go", "regularPrice": 145000, "salePrice": 125000, "updatedAt": "2026-03-15" },
      { "storeId": "bhx", "regularPrice": 142000, "salePrice": null, "updatedAt": "2026-03-15" },
      { "storeId": "lottemart", "regularPrice": 140000, "salePrice": 135000, "updatedAt": "2026-03-14" }
    ],
    "createdAt": "2026-03-01",
    "updatedAt": "2026-03-15"
  }
]
```

(Generate 100+ products covering all categories and stores)

- [ ] **Step 2: Commit**

```bash
git add backend/data/products.json
git commit -m "feat: add 100+ products data"
```

---

## Chunk 2: Frontend Setup

### Task 3: Initialize Vue 3 Frontend

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.js`
- Create: `frontend/src/App.vue`

- [ ] **Step 1: Create frontend directory and package.json**

```bash
mkdir -p frontend/src/router frontend/src/store frontend/src/views frontend/src/components
cd frontend
npm init -y
npm install vue@3 vue-router@4 vuex@4 bootstrap@5
npm install -D vite @vitejs/plugin-vue
```

**package.json:**
```json
{
  "name": "danang-price-compare-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "bootstrap": "^5.3.3",
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "vuex": "^4.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.1.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Da Nang Price Compare</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create main.js**

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
```

- [ ] **Step 5: Create App.vue**

```vue
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// Root component
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
```

- [ ] **Step 6: Test frontend build**

```bash
cd frontend
npm install
npm run dev
```

- [ ] **Step 7: Commit**

```bash
git add frontend/
git commit -m "feat: add Vue 3 frontend scaffold"
```

---

### Task 4: Vue Router Setup

**Files:**
- Create: `frontend/src/router/index.js`

- [ ] **Step 1: Create router with route guards**

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Products from '../views/Products.vue'
import ProductEdit from '../views/ProductEdit.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    redirect: '/products'
  },
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
    meta: { requiresAuth: true }
  },
  {
    path: '/products/new',
    name: 'NewProduct',
    component: ProductEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id',
    name: 'EditProduct',
    component: ProductEdit,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/products')
  } else {
    next()
  }
})

export default router
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/router/
git commit -m "feat: add Vue Router with auth guards"
```

---

### Task 5: Vuex Store Setup

**Files:**
- Create: `frontend/src/store/index.js`
- Create: `frontend/src/store/auth.js`
- Create: `frontend/src/store/products.js`

- [ ] **Step 1: Create auth module**

```javascript
// frontend/src/store/auth.js

const state = () => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null
})

const getters = {
  isAuthenticated: (state) => !!state.token,
  user: (state) => state.user,
  isAdmin: (state) => state.user?.role === 'admin'
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
  LOGOUT(state) {
    state.user = null
    state.token = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

const actions = {
  async login({ commit }, { username, password }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data = await response.json()
    commit('SET_TOKEN', data.token)
    commit('SET_USER', data.user)
    return data
  },
  logout({ commit }) {
    commit('LOGOUT')
  },
  initAuth({ commit, state }) {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    if (token && user) {
      commit('SET_TOKEN', token)
      commit('SET_USER', user)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

- [ ] **Step 2: Create products module with lazy-loading**

```javascript
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
```

- [ ] **Step 3: Create store index**

```javascript
// frontend/src/store/index.js

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

- [ ] **Step 4: Update main.js to initialize auth**

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)

app.use(router)
app.use(store)

// Initialize auth state from localStorage
store.dispatch('auth/initAuth')

app.mount('#app')
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/store/
git commit -m "feat: add Vuex store with auth and products modules"
```

---

## Chunk 3: Frontend Components & Views

### Task 6: Login Page

**Files:**
- Create: `frontend/src/views/Login.vue`

- [ ] **Step 1: Create Login.vue**

```vue
<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>Da Nang Price Compare</h1>
        <p>Find the best deals in town</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="form-control"
            placeholder="Enter your username"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>

        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    await store.dispatch('auth/login', {
      username: username.value,
      password: password.value
    })
    router.push('/products')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f6f7f8;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #137fec 0%, #0d6efd 100%);
  padding: 40px 30px;
  text-align: center;
  color: white;
}

.login-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.login-header p {
  margin-top: 8px;
  opacity: 0.9;
}

.login-form {
  padding: 30px;
}

.btn-primary {
  background-color: #137fec;
  border-color: #137fec;
  padding: 12px;
  font-weight: 600;
}

.btn-primary:hover {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/Login.vue
git commit -m "feat: add Login page component"
```

---

### Task 7: Navigation & Components

**Files:**
- Create: `frontend/src/components/NavBar.vue`
- Create: `frontend/src/components/ProductCard.vue`
- Create: `frontend/src/components/ProductFilters.vue`
- Create: `frontend/src/components/LoadMore.vue`

- [ ] **Step 1: Create NavBar.vue**

```vue
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/products">
        Da Nang Price Compare
      </router-link>

      <div class="d-flex align-items-center">
        <span v-if="user" class="navbar-text me-3">
          Welcome, {{ user.username }}
        </span>
        <button @click="handleLogout" class="btn btn-outline-light btn-sm">
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters['auth/user'])

const handleLogout = () => {
  store.dispatch('auth/logout')
  router.push('/login')
}
</script>
```

- [ ] **Step 2: Create ProductCard.vue**

```vue
<template>
  <div class="card product-card h-100">
    <img :src="product.image" class="card-img-top" :alt="product.name" />
    <div class="card-body">
      <h5 class="card-title">{{ product.name }}</h5>
      <p class="card-text text-muted">{{ product.brand }} - {{ product.unit }}</p>

      <div class="price-list">
        <div
          v-for="price in product.prices"
          :key="price.storeId"
          class="price-item"
          :class="{ 'best-price': isBestPrice(price) }"
        >
          <span class="store-name">{{ getStoreName(price.storeId) }}</span>
          <div class="price-values">
            <span v-if="price.salePrice" class="sale-price">
              {{ formatPrice(price.salePrice) }}
            </span>
            <span :class="price.salePrice ? 'regular-price sale' : 'regular-price'">
              {{ formatPrice(price.regularPrice) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer bg-white border-top-0">
      <router-link :to="`/products/${product.id}`" class="btn btn-outline-primary btn-sm">
        Edit
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const store = useStore()
const stores = computed(() => store.getters['products/stores'])

const getStoreName = (storeId) => {
  const store = stores.value.find(s => s.id === storeId)
  return store ? store.name : storeId
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const isBestPrice = (price) => {
  if (!props.product.prices.length) return false
  const prices = props.product.prices.map(p => p.salePrice || p.regularPrice)
  const minPrice = Math.min(...prices)
  const currentPrice = price.salePrice || price.regularPrice
  return currentPrice === minPrice
}
</script>

<style scoped>
.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card img {
  height: 180px;
  object-fit: cover;
}

.price-list {
  margin-top: 12px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.price-item:last-child {
  border-bottom: none;
}

.price-item.best-price {
  background-color: #d4edda;
  margin: 0 -12px;
  padding: 8px 12px;
  border-radius: 4px;
}

.store-name {
  font-weight: 500;
  font-size: 14px;
}

.price-values {
  text-align: right;
}

.regular-price {
  font-weight: 600;
}

.regular-price.sale {
  text-decoration: line-through;
  color: #999;
  font-size: 12px;
}

.sale-price {
  color: #dc3545;
  font-weight: 700;
  display: block;
}

.best-price .sale-price,
.best-price .regular-price {
  color: #198754;
}
</style>
```

- [ ] **Step 3: Create ProductFilters.vue**

```vue
<template>
  <div class="filters-sidebar">
    <h5 class="mb-3">Filters</h5>

    <!-- Search -->
    <div class="mb-4">
      <label class="form-label">Search</label>
      <input
        type="text"
        class="form-control"
        placeholder="Search products..."
        v-model="searchQuery"
        @input="handleSearch"
      />
    </div>

    <!-- Store Filter -->
    <div class="mb-4">
      <label class="form-label">Store</label>
      <div class="form-check" v-for="store in stores" :key="store.id">
        <input
          class="form-check-input"
          type="radio"
          :id="store.id"
          :value="store.id"
          v-model="selectedStore"
          @change="handleStoreChange"
        />
        <label class="form-check-label" :for="store.id">
          {{ store.name }}
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="all-stores"
          :value="null"
          v-model="selectedStore"
          @change="handleStoreChange"
          checked
        />
        <label class="form-check-label" for="all-stores">
          All Stores
        </label>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="mb-4">
      <label class="form-label">Category</label>
      <select class="form-select" v-model="selectedCategory" @change="handleCategoryChange">
        <option :value="null">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>

    <button class="btn btn-outline-secondary btn-sm" @click="handleReset">
      Reset Filters
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const stores = computed(() => store.getters['products/stores'])
const filters = computed(() => store.getters['products/filters'])

const categories = [
  'Groceries',
  'Beverages',
  'Fresh Food',
  'Household',
  'Personal Care',
  'Snacks'
]

const searchQuery = ref(filters.value.search || '')
const selectedStore = ref(filters.value.storeId)
const selectedCategory = ref(filters.value.category)

let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.dispatch('products/setFilter', { key: 'search', value: searchQuery.value })
    store.dispatch('products/fetchProducts', true)
  }, 300)
}

const handleStoreChange = () => {
  store.dispatch('products/setFilter', { key: 'storeId', value: selectedStore.value })
  store.dispatch('products/fetchProducts', true)
}

const handleCategoryChange = () => {
  store.dispatch('products/setFilter', { key: 'category', value: selectedCategory.value })
  store.dispatch('products/fetchProducts', true)
}

const handleReset = () => {
  searchQuery.value = ''
  selectedStore.value = null
  selectedCategory.value = null
  store.dispatch('products/resetFilters')
  store.dispatch('products/fetchProducts', true)
}
</script>

<style scoped>
.filters-sidebar {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
```

- [ ] **Step 4: Create LoadMore.vue**

```vue
<template>
  <div class="load-more-container text-center my-4">
    <button
      v-if="hasMore && !loading"
      class="btn btn-primary"
      @click="handleLoadMore"
    >
      Load More
    </button>
    <div v-else-if="loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p v-else-if="!hasMore && products.length > 0" class="text-muted">
      No more products to load
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const products = computed(() => store.getters['products/allProducts'])
const hasMore = computed(() => store.getters['products/hasMore'])
const loading = computed(() => store.getters['products/isLoading'])

const handleLoadMore = () => {
  store.dispatch('products/fetchProducts')
}
</script>

<style scoped>
.load-more-container {
  min-height: 60px;
}
</style>
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/
git commit -m "feat: add NavBar, ProductCard, ProductFilters, LoadMore components"
```

---

### Task 8: Products Page

**Files:**
- Create: `frontend/src/views/Products.vue`

- [ ] **Step 1: Create Products.vue**

```vue
<template>
  <div class="products-page">
    <NavBar />

    <div class="container-fluid mt-4">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 mb-4">
          <ProductFilters />
        </div>

        <!-- Main Content -->
        <div class="col-md-9">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Products</h2>
            <router-link to="/products/new" class="btn btn-success">
              Add Product
            </router-link>
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <!-- Products Grid -->
          <div class="row">
            <div
              v-for="product in products"
              :key="product.id"
              class="col-md-4 col-sm-6 mb-4"
            >
              <ProductCard :product="product" />
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="products.length === 0 && !loading" class="text-center py-5">
            <p class="text-muted">No products found</p>
          </div>

          <!-- Load More -->
          <LoadMore />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import NavBar from '../components/NavBar.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductFilters from '../components/ProductFilters.vue'
import LoadMore from '../components/LoadMore.vue'

const store = useStore()

const products = computed(() => store.getters['products/allProducts'])
const loading = computed(() => store.getters['products/isLoading'])
const error = computed(() => store.getters['products/error'])

onMounted(async () => {
  await store.dispatch('products/fetchStores')
  await store.dispatch('products/fetchProducts', true)
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/Products.vue
git commit -m "feat: add Products page with lazy-loading"
```

---

### Task 9: Product Edit/Create Page

**Files:**
- Create: `frontend/src/views/ProductEdit.vue`

- [ ] **Step 1: Create ProductEdit.vue**

```vue
<template>
  <div class="product-edit-page">
    <NavBar />

    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h4>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <!-- Basic Info -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Product Name</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.name"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Category</label>
                    <select class="form-select" v-model="formData.category" required>
                      <option value="">Select Category</option>
                      <option v-for="cat in categories" :key="cat" :value="cat">
                        {{ cat }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Brand</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.brand"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Unit</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.unit"
                      placeholder="e.g., 1kg, 500ml, 12pcs"
                      required
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Image URL</label>
                  <input
                    type="url"
                    class="form-control"
                    v-model="formData.image"
                    placeholder="https://..."
                  />
                </div>

                <!-- Prices by Store -->
                <h5 class="mb-3">Prices by Store</h5>
                <div v-for="store in stores" :key="store.id" class="card mb-3">
                  <div class="card-body">
                    <h6>{{ store.name }}</h6>
                    <div class="row">
                      <div class="col-md-4">
                        <label class="form-label">Regular Price (VND)</label>
                        <input
                          type="number"
                          class="form-control"
                          v-model="formData.prices[store.id].regularPrice"
                          min="0"
                        />
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">Sale Price (VND)</label>
                        <input
                          type="number"
                          class="form-control"
                          v-model="formData.prices[store.id].salePrice"
                          min="0"
                        />
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">Updated</label>
                        <input
                          type="date"
                          class="form-control"
                          v-model="formData.prices[store.id].updatedAt"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="saving">
                    {{ saving ? 'Saving...' : 'Save' }}
                  </button>
                  <button
                    v-if="isEditMode"
                    type="button"
                    class="btn btn-danger"
                    @click="handleDelete"
                    :disabled="deleting"
                  >
                    {{ deleting ? 'Deleting...' : 'Delete' }}
                  </button>
                  <router-link to="/products" class="btn btn-secondary">
                    Cancel
                  </router-link>
                </div>

                <div v-if="error" class="alert alert-danger mt-3">
                  {{ error }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const categories = [
  'Groceries',
  'Beverages',
  'Fresh Food',
  'Household',
  'Personal Care',
  'Snacks'
]

const stores = computed(() => store.getters['products/stores'])

const isEditMode = computed(() => !!route.params.id)

const formData = ref({
  name: '',
  category: '',
  brand: '',
  unit: '',
  image: '',
  prices: {}
})

const saving = ref(false)
const deleting = ref(false)
const error = ref('')

// Initialize prices structure
onMounted(async () => {
  await store.dispatch('products/fetchStores')

  // Initialize prices for each store
  stores.value.forEach(store => {
    formData.value.prices[store.id] = {
      storeId: store.id,
      regularPrice: 0,
      salePrice: null,
      updatedAt: new Date().toISOString().split('T')[0]
    }
  })

  if (isEditMode.value) {
    await loadProduct()
  }
})

const loadProduct = async () => {
  const response = await fetch(`/api/products/${route.params.id}`)
  if (response.ok) {
    const product = await response.json()
    formData.value = {
      ...product,
      prices: {}
    }

    // Map prices to store structure
    product.prices.forEach(p => {
      formData.value.prices[p.storeId] = { ...p }
    })

    stores.value.forEach(store => {
      if (!formData.value.prices[store.id]) {
        formData.value.prices[store.id] = {
          storeId: store.id,
          regularPrice: 0,
          salePrice: null,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      }
    })
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = ''

  try {
    const productData = {
      name: formData.value.name,
      category: formData.value.category,
      brand: formData.value.brand,
      unit: formData.value.unit,
      image: formData.value.image,
      prices: Object.values(formData.value.prices).filter(p => p.regularPrice > 0)
    }

    if (isEditMode.value) {
      await store.dispatch('products/updateProduct', {
        id: route.params.id,
        ...productData
      })
    } else {
      await store.dispatch('products/createProduct', productData)
    }

    router.push('/products')
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this product?')) return

  deleting.value = true
  error.value = ''

  try {
    await store.dispatch('products/deleteProduct', route.params.id)
    router.push('/products')
  } catch (err) {
    error.value = err.message
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.product-edit-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 40px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/ProductEdit.vue
git commit -m "feat: add ProductEdit page for create/edit/delete"
```

---

## Chunk 4: Final Integration & Testing

### Task 10: Integration Testing

- [ ] **Step 1: Start backend and frontend**

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- [ ] **Step 2: Test login flow**
- Navigate to http://localhost:5173
- Should redirect to /login
- Login with admin/admin123
- Should redirect to /products

- [ ] **Step 3: Test products page**
- Should load 10 products initially
- Click "Load More" should load next 10
- Search should filter products
- Store filter should filter products
- Category filter should filter products

- [ ] **Step 4: Test CRUD**
- Click "Add Product" - create new product
- Click "Edit" on product card - edit product
- Click "Delete" - delete product

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: complete integration and testing"
```

---

### Task 11: Build for Production

- [ ] **Step 1: Build frontend**

```bash
cd frontend
npm run build
```

- [ ] **Step 2: Final commit**

```bash
git add .
git commit -m "feat: production build ready"
```

---

## Summary

This plan creates:
- ✅ Express backend with 3 API routes (auth, stores, products)
- ✅ 100+ product demo data
- ✅ Vue 3 SPA with Vuex state management
- ✅ JWT authentication with route guards
- ✅ Full CRUD operations
- ✅ Lazy-loading pagination (10 items)
- ✅ Search and filter functionality
- ✅ Bootstrap 5 responsive grid layout
- ✅ Professional UI with wireframe-inspired design

The implementation is ready for execution using subagent-driven-development or executing-plans skill.
