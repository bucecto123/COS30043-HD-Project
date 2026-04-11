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

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
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
router.post('/', authenticate, requireAdmin, (req, res) => {
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
router.put('/:id', authenticate, requireAdmin, (req, res) => {
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
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
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
