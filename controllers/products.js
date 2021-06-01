const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product to your cart',
        path: '/admin/add-product/',
        editing: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    //The following method in the req.user (sequelize object referenced to a Product)
    // "createProduct" is generated dynamically by sequelize and the reason is that 
    // we have defined the association between an User and a Product in the app.js 
    //Product.belongsTo(User)

    req.user.createProduct({ 
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id 
    })
    .then(result => {
            if (result) {
                console.log("Product created successfully");
                console.log(result.get({
                    plain: true
                }));
                console.log('without the plain true');
                console.log(result);
                res.redirect('/admin/products');
            }

        })
        .catch(err => console.log(err));
}

// exports.getEditProduct = (req, res, next) => {
//     res.render('admin/edit-product', {
//         pageTitle: 'Edit product from your cart',
//         path: '/admin/add-product/'       
//     });
// };

exports.getEditProduct = (req, res, next) => {

    const editMode = req.query.edit;
    console.log("edit mode is: " + editMode);
    if (!editMode) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    //This will retrieve the list of products associated to the user
    //whe can filter out based with the id of the product that we have available
    req.user.getProducts({where: {
        id: productId
    }})
    //Product.findByPk(productId)
    .then(products => {
            const product = products[0]; //reason for this is because that the getProducts always returns an array
            if (!product) {
                return res.redirect('/');
            }
            console.log("The product id is: " + productId);
            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
    })
    .catch(err => {
            console.log(err);
    });



};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    console.log("attempting to delete product with id: " + productId);
    Product.findByPk(productId)
        .then(product => {
            product.destroy();
        })
        .then(result => {
            console.log("Product with id " + productId + " has been deleted! ");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};

exports.postEditProduct = (req, res, next) => {
    console.log("entering postEditProduct");

    const id = req.body.id;
    console.log("The id: " + id);
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findByPk(id)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {
            if (result) {
                console.log('Updated product');
                res.redirect('/admin/products');
            }
        })
        .catch(err => console.log(err));
};


