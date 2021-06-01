const Product = require('../models/product');

exports.getProductList = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'The Shop',
                prods: products,
                path: '/products'
            });
        })
        .catch(err => {
            if (err) {
                console.log(err);
            }
        });

};

exports.getProductDetail = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: product.title,
                product: product,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });

    // Product.findAll({
    //     where: {
    //         id: prodId
    //     }
    // })
    //     .then(products => {
    //         res.render('shop/product-detail', {
    //             pageTitle: products[0].title,
    //             product: products[0],
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => console.log(err));

};


exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'The Shop',
                prods: products,
                path: '/'
            });
        })
        .catch(err => {
            if (err) {
                console.log(err);
            }
        });


};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        pageTitle: 'Your shopping cart',
                        path: '/cart',
                        cartProducts: products
                    });
                })
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));

};

exports.postCart = (req, res, next) => {

    const productId = req.body.productId;
    let newQuantity = 1;
    let fetchedCart;

    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQty = product.cartItem.quantity;
                newQuantity = oldQty + 1;
                return product;
            }
            return Product.findByPk(productId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req,res,next) => {
    let fetchedCart; 
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;        
        return cart.getProducts();
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            return order.addProducts(products.map(product => {
                product.orderItem = {quantity: product.cartItem.quantity}                
                return product; 
            }))
        })
        .catch(err => {
            console.log('Error when adding products to the order');
            console.log(err)
        });
    })
    .then(result => {
        return fetchedCart.setProducts(null); //If an order is placed, then the cartItems should be cleaned       
    })
    .then(result => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
}

exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({where: {id: productId}});
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']}) 
    .then(orders => {        
        res.render('shop/orders', {
            pageTitle: 'Order Summary',
            path: '/orders',
            orders: orders
        });
    })
    .catch(err => console.log(err));    
};


