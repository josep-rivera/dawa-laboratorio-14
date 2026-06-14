const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory } = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', getAllCategories);
router.post('/', authenticate, authorize('ADMIN'), createCategory);

module.exports = router;
