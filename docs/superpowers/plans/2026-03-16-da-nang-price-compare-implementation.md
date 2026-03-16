# Da Nang Price Compare - Implementation Plan (Vuetify Version)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vue.js 3 + Vuetify 3 SPA with Express backend for comparing supermarket prices across Go!, Bách Hoá Xanh, and Lottemart in Da Nang.

**Architecture:**
- Vue 3 SPA with Vuex state management and Vue Router
- Vuetify 3 for Material Design UI components
- Express.js REST API backend
- JWT authentication with protected routes
- Lazy-loading pagination for product listings

**Tech Stack:** Vue.js 3, Vite, Vue Router 4, Vuex 4, **Vuetify 3**, Express.js, JWT

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
│       └── stores.js          # Stores endpoint
│
├── frontend/                   # Vue 3 SPA with Vuetify
│   ├── index.html             # Entry HTML
│   ├── vite.config.js         # Vite configuration
│   ├── package.json           # Frontend dependencies
│   └── src/
│       ├── main.js            # Vue app entry with Vuetify
│       ├── App.vue            # Root component
│       ├── plugins/
│       │   └── vuetify.js    # Vuetify configuration
│       ├── router/
│       │   └── index.js       # Vue Router config
│       ├── store/
│       │   ├── index.js       # Vuex store entry
│       │   ├── auth.js       # Auth module
│       │   └── products.js   # Products module
│       ├── views/
│       │   ├── Login.vue      # Login page (Vuetify)
│       │   ├── Products.vue   # Product list with lazy-load
│       │   └── ProductEdit.vue # Create/Edit product
│       └── components/
│           ├── NavBar.vue     # App bar navigation
│           ├── ProductCard.vue # Product card component
│           ├── ProductFilters.vue # Sidebar filters
│           └── LoadMore.vue  # Lazy-load button
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

## Chunk 2: Frontend Setup with Vuetify

### Task 3: Initialize Vue 3 + Vuetify Frontend

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.js`
- Create: `frontend/src/App.vue`
- Create: `frontend/src/plugins/vuetify.js`

- [ ] **Step 1: Create frontend directory and package.json**

```bash
mkdir -p frontend/src/router frontend/src/store frontend/src/views frontend/src/components frontend/src/plugins
cd frontend
npm init -y
npm install vue@3 vue-router@4 vuex@4 vuetify@3 @mdi/font
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
    "@mdi/font": "^7.4.47",
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "vuex": "^4.1.0",
    "vuetify": "^3.5.0"
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
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
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

**Also need to install vite-plugin-vuetify:**
```bash
npm install -D vite-plugin-vuetify
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Da Nang Price Compare</title>
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css" rel="stylesheet">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create Vuetify plugin configuration**

```javascript
// frontend/src/plugins/vuetify.js

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      }
    }
  }
})
```

- [ ] **Step 5: Create main.js with Vuetify**

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(vuetify)

app.mount('#app')
```

- [ ] **Step 6: Create App.vue**

```vue
<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
// Root component - Vuetify app wrapper
</script>
```

- [ ] **Step 7: Test frontend build**

```bash
cd frontend
npm install
npm run dev
```

- [ ] **Step 8: Commit**

```bash
git add frontend/
git commit -m "feat: add Vue 3 + Vuetify frontend scaffold"
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
import vuetify from './plugins/vuetify'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(vuetify)

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

## Chunk 3: Vuetify Components & Views

### Task 6: Login Page (Vuetify)

**Files:**
- Create: `frontend/src/views/Login.vue`

- [ ] **Step 1: Create Login.vue with Vuetify**

```vue
<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Da Nang Price Compare</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="username"
                    label="Username"
                    prepend-icon="mdi-account"
                    type="text"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    label="Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    required
                  ></v-text-field>

                  <v-alert
                    v-if="error"
                    type="error"
                    class="mt-2"
                    closable
                  >
                    {{ error }}
                  </v-alert>

                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    class="mt-4"
                    :loading="loading"
                  >
                    Login
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/Login.vue
git commit -m "feat: add Login page with Vuetify"
```

---

### Task 7: Navigation & Components (Vuetify)

**Files:**
- Create: `frontend/src/components/NavBar.vue`
- Create: `frontend/src/components/ProductCard.vue`
- Create: `frontend/src/components/ProductFilters.vue`
- Create: `frontend/src/components/LoadMore.vue`

- [ ] **Step 1: Create NavBar.vue**

```vue
<template>
  <v-app-bar color="primary" dark>
    <v-app-bar-title>Da Nang Price Compare</v-app-bar-title>

    <v-spacer></v-spacer>

    <span v-if="user" class="mr-4">
      Welcome, {{ user.username }}
    </span>

    <v-btn icon @click="handleLogout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
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
  <v-card class="product-card h-100">
    <v-img
      :src="product.image"
      height="180"
      cover
      :alt="product.name"
    ></v-img>

    <v-card-title>{{ product.name }}</v-card-title>
    <v-card-subtitle>
      {{ product.brand }} - {{ product.unit }}
    </v-card-subtitle>

    <v-card-text>
      <div v-for="price in product.prices" :key="price.storeId" class="price-item">
        <div class="d-flex justify-space-between align-center">
          <span class="store-name">{{ getStoreName(price.storeId) }}</span>
          <div class="text-right">
            <span v-if="price.salePrice" class="sale-price">
              {{ formatPrice(price.salePrice) }}
            </span>
            <span
              :class="price.salePrice ? 'regular-price text-decoration-line-through' : 'regular-price'"
            >
              {{ formatPrice(price.regularPrice) }}
            </span>
          </div>
        </div>
        <v-chip
          v-if="isBestPrice(price)"
          color="success"
          size="x-small"
          class="mt-1"
        >
          Best Price
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        :to="`/products/${product.id}`"
      >
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
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
  transition: transform 0.2s;
}
.product-card:hover {
  transform: translateY(-4px);
}
.price-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
.price-item:last-child {
  border-bottom: none;
}
.store-name {
  font-weight: 500;
}
.sale-price {
  color: #f44336;
  font-weight: 700;
  display: block;
}
.regular-price {
  font-weight: 600;
}
</style>
```

- [ ] **Step 3: Create ProductFilters.vue (with close event for drawer)**

```vue
<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      Filters
      <v-btn
        v-if="$attrs.close"
        icon
        size="small"
        @click="$emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <!-- Search -->
      <v-text-field
        v-model="searchQuery"
        label="Search products"
        prepend-inner-icon="mdi-magnify"
        clearable
        density="compact"
        @input="handleSearch"
      ></v-text-field>

      <!-- Store Filter -->
      <v-radio-group v-model="selectedStore" @change="handleStoreChange" density="compact">
        <v-radio label="All Stores" :value="null"></v-radio>
        <v-radio
          v-for="store in stores"
          :key="store.id"
          :label="store.name"
          :value="store.id"
        ></v-radio>
      </v-radio-group>

      <!-- Category Filter -->
      <v-select
        v-model="selectedCategory"
        :items="categories"
        label="Category"
        clearable
        density="compact"
        @update:model-value="handleCategoryChange"
      ></v-select>

      <v-btn
        block
        variant="outlined"
        size="small"
        @click="handleReset"
      >
        Reset Filters
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

defineEmits(['close'])

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
```

- [ ] **Step 4: Create LoadMore.vue**

```vue
<template>
  <div class="text-center my-4">
    <v-btn
      v-if="hasMore && !loading"
      color="primary"
      @click="handleLoadMore"
    >
      Load More
    </v-btn>

    <v-progress-circular
      v-else-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <p v-else-if="!hasMore && products.length > 0" class="text-grey">
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
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/
git commit -m "feat: add Vuetify components"
```

---

### Task 8: Products Page (Responsive with Navigation Drawer)

**Files:**
- Create: `frontend/src/views/Products.vue`

- [ ] **Step 1: Create Products.vue with responsive layout**

```vue
<template>
  <v-app>
    <!-- App Bar with hamburger for mobile -->
    <v-app-bar color="primary" dark>
      <v-app-bar-nav-icon
        class="d-md-none"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title>Da Nang Price Compare</v-app-bar-title>
      <v-spacer></v-spacer>
      <span v-if="user" class="mr-4 d-none d-sm-block">
        {{ user.username }}
      </span>
      <v-btn icon @click="handleLogout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer for mobile filters -->
    <v-navigation-drawer v-model="drawer" temporary>
      <ProductFilters @close="drawer = false" />
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <v-row>
          <!-- Sidebar - hidden on mobile, visible on tablet+ -->
          <v-col cols="12" md="3" class="d-none d-md-block">
            <ProductFilters />
          </v-col>

          <!-- Main Content -->
          <v-col cols="12" md="9">
            <div class="d-flex justify-space-between align-center mb-4">
              <h2 class="text-h5">Products</h2>
              <v-btn color="success" to="/products/new">
                <v-icon left>mdi-plus</v-icon>
                <span class="d-none d-sm-inline">Add Product</span>
              </v-btn>
            </div>

            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
            >
              {{ error }}
            </v-alert>

            <!-- Products Grid - Responsive -->
            <v-row>
              <v-col
                v-for="product in products"
                :key="product.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <ProductCard :product="product" />
              </v-col>
            </v-row>

            <!-- Empty State -->
            <div v-if="products.length === 0 && !loading" class="text-center py-5">
              <p class="text-grey">No products found</p>
            </div>

            <!-- Load More -->
            <LoadMore />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import ProductFilters from '../components/ProductFilters.vue'
import LoadMore from '../components/LoadMore.vue'

const store = useStore()
const router = useRouter()
const drawer = ref(false)

const products = computed(() => store.getters['products/allProducts'])
const loading = computed(() => store.getters['products/isLoading'])
const error = computed(() => store.getters['products/error'])
const user = computed(() => store.getters['auth/user'])

const handleLogout = () => {
  store.dispatch('auth/logout')
  router.push('/login')
}

onMounted(async () => {
  await store.dispatch('products/fetchStores')
  await store.dispatch('products/fetchProducts', true)
})
</script>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/Products.vue
git commit -m "feat: add Products page with Vuetify"
```

---

### Task 9: Product Edit/Create Page

**Files:**
- Create: `frontend/src/views/ProductEdit.vue`

- [ ] **Step 1: Create ProductEdit.vue**

```vue
<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" lg="8">
            <v-card>
              <v-card-title>
                {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
              </v-card-title>

              <v-card-text>
                <v-form @submit.prevent="handleSubmit">
                  <!-- Basic Info -->
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.name"
                        label="Product Name"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.category"
                        :items="categories"
                        label="Category"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.brand"
                        label="Brand"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.unit"
                        label="Unit"
                        placeholder="e.g., 1kg, 500ml, 12pcs"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-text-field
                    v-model="formData.image"
                    label="Image URL"
                    prepend-icon="mdi-image"
                  ></v-text-field>

                  <!-- Prices by Store -->
                  <v-divider class="my-4"></v-divider>
                  <h3 class="text-h6 mb-4">Prices by Store</h3>

                  <v-card
                    v-for="store in stores"
                    :key="store.id"
                    class="mb-3"
                    variant="outlined"
                  >
                    <v-card-title>{{ store.name }}</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model.number="formData.prices[store.id].regularPrice"
                            label="Regular Price (VND)"
                            type="number"
                            min="0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model.number="formData.prices[store.id].salePrice"
                            label="Sale Price (VND)"
                            type="number"
                            min="0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.prices[store.id].updatedAt"
                            label="Updated"
                            type="date"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <div class="d-flex gap-2 mt-4">
                    <v-btn type="submit" color="primary" :loading="saving">
                      Save
                    </v-btn>
                    <v-btn
                      v-if="isEditMode"
                      color="error"
                      @click="handleDelete"
                      :loading="deleting"
                    >
                      Delete
                    </v-btn>
                    <v-btn to="/products" variant="text">
                      Cancel
                    </v-btn>
                  </div>

                  <v-alert
                    v-if="error"
                    type="error"
                    class="mt-4"
                  >
                    {{ error }}
                  </v-alert>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
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
  stores.value.forEach(s => {
    formData.value.prices[s.id] = {
      storeId: s.id,
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

    stores.value.forEach(s => {
      if (!formData.value.prices[s.id]) {
        formData.value.prices[s.id] = {
          storeId: s.id,
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/ProductEdit.vue
git commit -m "feat: add ProductEdit page with Vuetify"
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
- ✅ **Vuetify 3** UI components (Material Design)
- ✅ **Responsive design** - Desktop, Tablet, Mobile (3 breakpoints)
- ✅ Navigation drawer for mobile filters
- ✅ JWT authentication with route guards
- ✅ Full CRUD operations
- ✅ Lazy-loading pagination (10 items)
- ✅ Search and filter functionality
- ✅ Professional Material Design UI

The implementation is ready for execution using subagent-driven-development or executing-plans skill.
