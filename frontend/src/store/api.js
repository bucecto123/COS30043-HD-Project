// frontend/src/store/api.js
// Auth uses Axios → Express backend
// Products/Stores use Supabase (real crawled data)

import axios from 'axios'
import { supabase } from '../utils/supabase'

// ---------------------------------------------------------------------------
// Axios instance (auth only)
// ---------------------------------------------------------------------------

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.dispatchEvent(new CustomEvent('auth:expired'))
      }
      throw new Error(data?.message || `Request failed with status ${status}`)
    }
    if (error.code === 'ECONNABORTED') throw new Error('Request timeout. Please try again.')
    if (!error.response) throw new Error('Unable to connect to server. Please check if the backend is running.')
    throw error
  }
)

// ---------------------------------------------------------------------------
// Auth API — Express backend
// ---------------------------------------------------------------------------

export const authApi = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (username, password) => api.post('/auth/register', { username, password })
}

// ---------------------------------------------------------------------------
// Category mapping — Vietnamese Supabase categories → English UI categories
// ---------------------------------------------------------------------------

const CATEGORY_MAP = {
  'BIA, NƯỚC GIẢI KHÁT': 'Beverages',
  'BÁNH KẸO CÁC LOẠI': 'Snacks',
  'Snacks': 'Snacks',
  'Bánh quy - Bánh quy giòn': 'Snacks',
  'Bánh truyền thống - theo mùa': 'Snacks',
  'SỮA CÁC LOẠI': 'Dairy',
  'KEM, SỮA CHUA': 'Dairy',
  'Sữa thanh trùng - Sữa tiệt trùng': 'Dairy',
  'Sữa đặc': 'Dairy',
  'GẠO, BỘT, ĐỒ KHÔ': 'Rice & Noodles',
  'MÌ, MIẾN, CHÁO, PHỞ': 'Rice & Noodles',
  'Đồ hộp - đồ khô': 'Canned Goods',
  'DẦU ĂN, NƯỚC CHẤM, GIA VỊ': 'Condiments',
  'Đường': 'Condiments',
  'THỊT, CÁ, TRỨNG, HẢI SẢN': 'Frozen Foods',
  'Xúc xích - Dăm bông - Thịt nguội': 'Frozen Foods',
  'Xúc xích tươi': 'Frozen Foods',
  'Hải sản khô ăn liền': 'Frozen Foods',
  'CHĂM SÓC CÁ NHÂN': 'Personal Care',
  'Làm đẹp & Chăm sóc cá nhân': 'Personal Care',
  'Kem đánh răng': 'Personal Care',
  'Bàn chải đánh răng': 'Personal Care',
  'Sữa tắm': 'Personal Care',
  'Kem dưỡng da': 'Personal Care',
  'Thuốc nhuộm tóc': 'Personal Care',
  'Bộ nồi': 'Household',
  'Nồi cơm điện': 'Household',
  'Nồi hấp': 'Household',
  'Nước rửa chén': 'Household',
  'Lò vi sóng - Lò nướng': 'Household',
  'Thiết bị thể thao trong nhà': 'Household',
  'Vali': 'Household',
  'RAU, CỦ, NẤM, TRÁI CÂY': 'Others',
  'Cam quýt bưởi nhập khẩu': 'Others',
  'Hoa tươi': 'Others',
  'KHÁC': 'Others'
}

const REVERSE_CATEGORY_MAP = {
  'Beverages': ['BIA, NƯỚC GIẢI KHÁT'],
  'Snacks': ['BÁNH KẸO CÁC LOẠI', 'Snacks', 'Bánh quy - Bánh quy giòn', 'Bánh truyền thống - theo mùa'],
  'Dairy': ['SỮA CÁC LOẠI', 'KEM, SỮA CHUA', 'Sữa thanh trùng - Sữa tiệt trùng', 'Sữa đặc'],
  'Rice & Noodles': ['GẠO, BỘT, ĐỒ KHÔ', 'MÌ, MIẾN, CHÁO, PHỞ'],
  'Canned Goods': ['Đồ hộp - đồ khô'],
  'Condiments': ['DẦU ĂN, NƯỚC CHẤM, GIA VỊ', 'Đường'],
  'Frozen Foods': ['THỊT, CÁ, TRỨNG, HẢI SẢN', 'Xúc xích - Dăm bông - Thịt nguội', 'Xúc xích tươi', 'Hải sản khô ăn liền'],
  'Personal Care': ['CHĂM SÓC CÁ NHÂN', 'Làm đẹp & Chăm sóc cá nhân', 'Kem đánh răng', 'Bàn chải đánh răng', 'Sữa tắm', 'Kem dưỡng da', 'Thuốc nhuộm tóc'],
  'Household': ['Bộ nồi', 'Nồi cơm điện', 'Nồi hấp', 'Nước rửa chén', 'Lò vi sóng - Lò nướng', 'Thiết bị thể thao trong nhà', 'Vali'],
  'Others': ['RAU, CỦ, NẤM, TRÁI CÂY', 'Cam quýt bưởi nhập khẩu', 'Hoa tươi', 'KHÁC']
}

const SOURCE_NAMES = {
  go: 'Go!',
  bhx: 'Bách Hoá Xanh',
  lotte: 'Lottemart'
}

// Map a raw Supabase row to the Product shape the app expects
function mapRow(row) {
  const rawCat = row.category_l1 || row.category_hint || ''
  const category = CATEGORY_MAP[rawCat] || 'Others'

  let unit = row.unit_label || ''
  if (!unit && row.unit_size && row.unit_type) {
    unit = `${row.unit_size}${row.unit_type}`
  }

  return {
    id: row.product_id,
    name: row.name || row.name_normalized || 'Unknown',
    brand: row.brand || SOURCE_NAMES[row.source] || row.source,
    category,
    unit,
    image: row.thumbnail_url || row.image_url || '',
    prices: [{
      storeId: row.source,
      regularPrice: row.price_original || row.price,
      salePrice: row.price_original ? row.price : null
    }]
  }
}

// ---------------------------------------------------------------------------
// Products API — Supabase
// ---------------------------------------------------------------------------

export const productsApi = {
  async getAll({ page = 1, limit = 10, search = '', storeId = null, category = null } = {}) {
    let query = supabase
      .from('normalized_products')
      .select('*', { count: 'exact' })
      .eq('in_stock', true)
      .order('updated_at', { ascending: false })

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (storeId) {
      query = query.eq('source', storeId)
    }

    if (category) {
      const viCategories = REVERSE_CATEGORY_MAP[category] || []
      if (viCategories.length > 0) {
        const orFilter = viCategories
          .map(c => `category_l1.eq."${c}",category_hint.eq."${c}"`)
          .join(',')
        query = query.or(orFilter)
      }
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    if (error) throw new Error(error.message)

    return {
      data: (data || []).map(mapRow),
      hasMore: page * limit < (count || 0)
    }
  },

  async getById(id) {
    // Try Supabase first (crawled products)
    const { data, error } = await supabase
      .from('normalized_products')
      .select('*')
      .eq('product_id', id)
      .single()

    if (!error && data) return mapRow(data)

    // Fallback to Express backend (user-created products)
    return api.get(`/products/${id}`)
  },

  // Create/update/delete use the Express backend (user-managed products)
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`)
}

// ---------------------------------------------------------------------------
// Stores API — static list matching Supabase source values
// ---------------------------------------------------------------------------

export const storesApi = {
  getAll: async () => [
    { id: 'go', name: 'Go!' },
    { id: 'bhx', name: 'Bách Hoá Xanh' },
    { id: 'lotte', name: 'Lottemart' }
  ]
}

export default api
