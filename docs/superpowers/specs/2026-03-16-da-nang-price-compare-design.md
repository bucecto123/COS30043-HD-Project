# Da Nang Supermarket Price Comparison App - Specification

## Project Overview

**Project Name:** Da Nang Price Compare
**Project Type:** Vue.js 3 SPA with Express Backend
**Core Functionality:** A supermarket price comparison application that tracks and compares product prices from Go!, Bách Hoá Xanh, and Lottemart in Da Nang, Vietnam.
**Target Users:** Da Nang shoppers looking for the best deals across local supermarkets.

---

## 1. Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue.js 3 (Composition API) |
| Styling | Bootstrap 5 |
| Build Tool | Vite |
| State Management | Vuex |
| Routing | Vue Router 4 |
| Backend | Express.js (Node.js) |
| Authentication | JWT |

---

## 2. Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Vue 3 Frontend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │   Router   │  │  Vuex Store │  │  Bootstrap 5    │    │
│  │ (Guards)   │  │  (State)    │  │  (Grid/Layout) │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Express Backend (Port 3000)                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  REST API Endpoints                                  │    │
│  │  GET/POST/PUT/DELETE /api/products                   │    │
│  │  GET /api/stores                                     │    │
│  │  POST /api/auth/login                                │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
1. UI Components dispatch Vuex actions
2. Vuex actions make async API calls to Express backend
3. Backend processes requests and returns JSON
4. Vuex mutations update state
5. Reactive UI updates automatically

---

## 3. Data Models

### Product Schema
```json
{
  "id": "string (UUID)",
  "name": "string",
  "category": "string",
  "brand": "string",
  "unit": "string",
  "image": "string (URL)",
  "prices": [
    {
      "storeId": "string",
      "regularPrice": "number",
      "salePrice": "number | null",
      "updatedAt": "date string"
    }
  ],
  "createdAt": "date string",
  "updatedAt": "date string"
}
```

### Store Schema
```json
{
  "id": "string",
  "name": "string",
  "location": "string (Da Nang)",
  "logo": "string (URL)"
}
```

### User Schema
```json
{
  "id": "string",
  "username": "string",
  "password": "string (hashed)",
  "role": "string (admin | user)"
}
```

---

## 4. API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get products with pagination (`?page=1&limit=10`) | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create new product | Yes (Admin) |
| PUT | `/api/products/:id` | Update product | Yes (Admin) |
| DELETE | `/api/products/:id` | Delete product | Yes (Admin) |
| GET | `/api/stores` | Get all stores | No |
| POST | `/api/auth/login` | Authenticate user | No |

---

## 5. Vuex Store Structure

```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false
  },
  products: {
    items: [],           // Lazy-loaded products
    currentPage: 1,
    hasMore: true,
    loading: false,
    error: null
  },
  stores: [
    { id: 'go', name: 'Go!', location: 'Da Nang', logo: '...' },
    { id: 'bhx', name: 'Bách Hoá Xanh', location: 'Da Nang', logo: '...' },
    { id: 'lottemart', name: 'Lottemart', location: 'Da Nang', logo: '...' }
  ],
  filters: {
    search: '',
    storeId: null,
    category: null
  }
}
```

---

## 6. Page Specifications

### 6.1 Login Page (`/login`)
- Centered login card with app branding
- Username and password input fields
- "Login" submit button
- Error message display for invalid credentials

### 6.2 Products Page (`/products`)
- **Header:** App logo, search bar, user profile/logout
- **Sidebar:**
  - Store filters (checkboxes for Go!, Bách Hoá Xanh, Lottemart)
  - Category filters (dropdown or checkboxes)
- **Main Content:**
  - Product grid (Bootstrap row/col)
  - Each card shows: image, name, brand, unit, price comparison from all stores
  - Lowest price highlighted
- **Footer:** "Load More" button for lazy-loading

### 6.3 Product Detail/Edit Page (`/products/:id`)
- Product information form (name, category, brand, unit, image)
- Price section per store (regular price, sale price, updated date)
- Save and Delete buttons (admin only)

### 6.4 Add Product Page (`/products/new`)
- Empty form for creating new product
- Save button (admin only)

---

## 7. Lazy-Loading Implementation

### Flow
1. Initial load: Fetch first 10 products (`GET /api/products?page=1&limit=10`)
2. User clicks "Load More"
3. Fetch next 10 products (`GET /api/products?page=2&limit=10`)
4. Append new items to Vuex state
5. Continue until API returns empty array
6. Hide "Load More" button when `hasMore` is false

### Vuex Action
```javascript
async fetchProducts({ commit, state }) {
  if (state.products.loading || !state.products.hasMore) return;

  commit('SET_LOADING', true);
  const page = state.products.currentPage + 1;

  try {
    const response = await fetch(`/api/products?page=${page}&limit=10`);
    const data = await response.json();

    if (data.length === 0) {
      commit('SET_HAS_MORE', false);
    } else {
      commit('APPEND_PRODUCTS', data);
      commit('SET_CURRENT_PAGE', page);
    }
  } catch (error) {
    commit('SET_ERROR', error.message);
  } finally {
    commit('SET_LOADING', false);
  }
}
```

---

## 8. Authentication & Authorization

### Route Guards
- `/products`, `/products/:id`, `/products/new` - require authentication
- Login page - redirect to products if already authenticated

### JWT Flow
1. User submits login credentials
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. Token included in Authorization header for protected requests
5. Vuex auth state updated on app initialization

---

## 9. Bootstrap Grid Layout

### Products Page Layout
```html
<div class="container-fluid">
  <div class="row">
    <!-- Sidebar -->
    <div class="col-md-3">
      <!-- Filters -->
    </div>

    <!-- Main Content -->
    <div class="col-md-9">
      <div class="row">
        <!-- Product Cards -->
        <div class="col-md-4 col-sm-6">
          <!-- Product Card -->
        </div>
      </div>

      <!-- Load More -->
      <div class="text-center my-4">
        <button>Load More</button>
      </div>
    </div>
  </div>
</div>
```

---

## 10. Demo Data

### Stores
1. **Go!** - Đường 2 Tháng 9, Hải Châu, Da Nang
2. **Bách Hoá Xanh** - Various locations in Da Nang
3. **Lottemart** - 01 Lê Duẩn, Hải Châu, Da Nang

### Categories
- Groceries
- Beverages
- Fresh Food
- Household
- Personal Care
- Snacks

### Products (100+ items)
Products will include common supermarket items:
- Rice, noodles, pasta
- Cooking oil, sauce, spices
- Fresh fruits and vegetables
- Meat and seafood
- Milk, yogurt, cheese
- Water, soft drinks, juices
- Soap, shampoo, detergent
- Snacks, chocolates, biscuits

---

## 11. Acceptance Criteria

### Authentication
- [ ] Login page displays correctly
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to products page
- [ ] Logout clears auth state and redirects to login

### Products Page
- [ ] Products display in Bootstrap grid
- [ ] Search filters products by name
- [ ] Store filter shows products with prices from selected stores
- [ ] Category filter shows products in selected category
- [ ] "Load More" fetches and appends 10 more products
- [ ] "Load More" hides when all products are loaded

### CRUD Operations
- [ ] Admin can create new product
- [ ] Admin can edit existing product
- [ ] Admin can delete product
- [ ] Changes persist to backend

### Technical Requirements
- [ ] Vuex manages all application state
- [ ] API calls happen inside Vuex actions
- [ ] Lazy-loading implemented with pagination
- [ ] Route guards protect authenticated routes
- [ ] Responsive Bootstrap layout

---

## 12. Deployment

- **Frontend:** Mercury Server (or similar static hosting)
- **Backend:** Mercury Server (Node.js)
- **API Base URL:** `/api` (same domain)

---

*Last Updated: 2026-03-16*
