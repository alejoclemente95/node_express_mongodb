const Product = require('../models/product');

exports.getProductList = (req, res, next) => {    
    Product.fetchAll()
    .then(products => {
        res.render('admin/products', {
            pageTitle: 'Products Admin',
            prods: products,
            path: '/admin/products'            
        });
    })
    .catch(err => console.log(err));
    
    // req.user.getProducts()
    // //Product.findAll()
    // .then(products => {
    //         res.render('admin/products', {
    //             pageTitle: 'Products Admin',
    //             prods: products,
    //             path: '/admin/products'            
    //         });
    // })
    // .catch(err => {
    //         if (err) {
    //             console.log(err);
    //         }
    // });

    
};