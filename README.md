# Da Nang Price Compare

A supermarket price comparison web application for Da Nang, Vietnam. Compare prices from Go!, Bách Hoá Xanh, and Lottemart supermarkets.

## Features

- **Price Comparison**: View and compare product prices across 3 major supermarkets
- **Product Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Lazy Loading**: Paginated product list (10 items per page)
- **Search & Filters**: Search by name, filter by store, filter by category
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Authentication**: JWT-based login/registration system

## Tech Stack

- **Frontend**: Vue.js 3, Vuetify 3, Vuex 4, Vue Router 4
- **Backend**: Express.js, JWT Authentication
- **Database**: JSON file-based (demo data)

## Project Structure

```
.
├── backend/           # Express.js API server
│   ├── data/         # JSON data files
│   ├── routes/      # API route handlers
│   └── server.js    # Main server entry
└── frontend/         # Vue.js application
    └── src/
        ├── components/  # Vue components
        ├── views/       # Page views
        ├── store/       # Vuex store
        ├── router/      # Vue Router config
        └── plugins/     # Vuetify setup
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. **Install backend dependencies:**
```bash
cd backend
npm install
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

### Running the Application

**Quick Start (using scripts):**
```bash
# Start both servers
scripts\start-dev.bat

# Stop both servers
scripts\stop-dev.bat
```

**Manual Start:**

**Backend server (Terminal 1):**
```bash
cd backend
node server.js
```
Backend runs on `http://localhost:3000`

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Demo Credentials

| Username | Password | Role   |
|----------|----------|--------|
| admin    | admin123 | Admin  |
| user     | user123  | User   |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/register` - Register new user account

### Stores
- `GET /api/stores` - Get all stores

### Products
- `GET /api/products` - Get products (with pagination & filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/:id` - Update product (requires auth)
- `DELETE /api/products/:id` - Delete product (requires auth)

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by product name
- `storeId` - Filter by store
- `category` - Filter by category

## Stopping the Servers

**Option 1: Ctrl+C**
- Press `Ctrl + C` in each terminal

**Option 2: Kill by port (Windows):**
```bash
# Find process on port
netstat -ano | findstr "3000"
taskkill /PID <PID_NUMBER> /F
```

**Option 3: Kill all node processes:**
```bash
taskkill /F /IM node.exe
```

## Quick Reference

| Action | Command |
|--------|---------|
| Install backend | `cd backend && npm install` |
| Install frontend | `cd frontend && npm install` |
| Run backend | `cd backend && node server.js` |
| Run frontend | `cd frontend && npm run dev` |
| Stop all | `taskkill /F /IM node.exe` |

## Data Import Guide

When crawling data from supermarkets (Go!, Bách Hoá Xanh, Lottemart), structure your data to match this schema:

### Product Schema

```json
{
  "id": "prod-001",           // Unique ID (auto-generated if empty)
  "name": "Vinamilk Gold 1L", // Product name (required)
  "category": "Beverages",    // Category: Beverages, Snacks, Dairy, Rice & Noodles, Canned Goods, Condiments, Frozen Foods, Personal Care, Household, Others
  "brand": "Vinamilk",         // Brand name (required)
  "unit": "1L",               // Unit: 500ml, 1kg, 6 cans, etc. (required)
  "image": "https://...",     // Image URL (optional)
  "prices": [                 // Array of prices (at least 1 required)
    {
      "storeId": "store-001", // Store ID (required): store-001=Go!, store-002=Bách Hoá Xanh, store-003=Lottemart
      "regularPrice": 45000,  // Regular price in VND (required)
      "salePrice": 39000,     // Sale price in VND (optional, null if no sale)
      "updatedAt": "2026-03-18" // Date format: YYYY-MM-DD
    }
  ],
  "createdAt": "2026-03-01",  // Auto-generated
  "updatedAt": "2026-03-18"   // Auto-generated
}
```

### Store IDs (Reference)

| storeId | Store Name |
|---------|------------|
| store-001 | Go! |
| store-002 | Bách Hoá Xanh |
| store-003 | Lottemart |

### Import Steps

1. **Prepare your crawled data** as a JSON array matching the schema above
2. **Backup existing data:** `cp backend/data/products.json backend/data/products.json.bak`
3. **Replace data:** Copy your JSON to `backend/data/products.json`
4. **Restart backend:** `Ctrl+C` then `node server.js`

### CSV Format Alternative

You can also import via CSV (convert to JSON first):

```csv
name,category,brand,unit,image,store-001-price,store-001-sale,store-002-price,store-002-sale,store-003-price,store-003-sale
Vinamilk Gold,Beverages,Vinamilk,1L,https://...,45000,39000,42000,,48000,
```

## License

MIT
