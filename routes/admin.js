const express = require('express');

const productController = require('../controllers/products');
const adminController = require('../controllers/admin-controller');

const router = express.Router();



// /admin/add-product => GET
router.get('/admin/add-product', productController.getAddProduct);

// /admin/add-product => POST
router.post('/admin/add-product', productController.postAddProduct);

//admin/products
router.get('/admin/products', adminController.getProductList);


module.exports = router;