// Routes sản phẩm — danh sách, chi tiết theo slug
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { optionalAuth } = require('../middleware/auth');

// GET /api/products          — danh sách + filter
router.get('/', ProductController.getAll);

// GET /api/products/:slug    — chi tiết theo slug
router.get('/:slug', optionalAuth, ProductController.getBySlug);

module.exports = router;
