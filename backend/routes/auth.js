const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const users = require('../data/users.json');

const router = express.Router();
const SECRET_KEY = 'danang-price-compare-secret-key';

// POST /api/auth/login - User login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
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

// POST /api/auth/register - User registration
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Check if user exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // Create new user
  const newUser = {
    id: `user-${String(users.length + 1).padStart(3, '0')}`,
    username,
    password,
    role: 'user', // Default role
    createdAt: new Date().toISOString()
  };

  // Save to users.json
  users.push(newUser);
  fs.writeFileSync(
    path.join(__dirname, '../data/users.json'),
    JSON.stringify(users, null, 2)
  );

  // Generate JWT token
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

module.exports = router;
