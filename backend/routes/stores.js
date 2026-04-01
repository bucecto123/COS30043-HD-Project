const express = require('express');
const stores = require('../data/stores.json');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(stores);
});

module.exports = router;
