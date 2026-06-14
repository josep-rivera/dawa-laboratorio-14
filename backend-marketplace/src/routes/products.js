const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize('ADMIN'), createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct);

module.exports = router;
