const express = require('express');

const shopController = require('../controllers/shop-controller');
const productController = require('../controllers/products');

const router = express.Router();

//index
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProductList);

router.get('/products/:productId', shopController.getProductDetail);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/delete-cart-item',shopController.deleteCartProduct);

router.post('/create-order',shopController.postOrder);

router.get('/orders', shopController.getOrders);

router.get('/checkout',shopController.getCheckout);

router.get('/edit-product/:productId', productController.getEditProduct);

router.post('/admin/edit-product', productController.postEditProduct);

router.post('/delete-product/', productController.postDeleteProduct);


module.exports = router;