const path = require('path');

const express = require('express');
const parser = require('body-parser');
//const expressHbs = require('express-handlebars');


const app = express();

//app.engine('handlebars', expressHbs({layoutsDir: 'views/layout', defaultLayout: 'main-layout'}));

//app.set('view engine','pug');
//app.set('view engine','handlebars');
//EJS is supported out of the box by express 
app.set('view engine','ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

//The following function is just registered, it won't execute with the npm start 
//it will trigger only with incoming requests 
app.use((req,res,next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();        
    })
    .catch(err => console.log(err));
});

//import models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const sequelize = require('./util/database');

app.use(express.static(path.join(__dirname, 'public')));

app.use(parser.urlencoded({extended: false}));

app.use(adminRoutes);
app.use(shopRoutes);

app.use(errorController.notFoundPage);


//Setting up the relations in the DB tables
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}); //This relation is an User adding a Product (admin role)
User.hasMany(Product); //This relation is an user is purchasing and can have many products
User.hasOne(Cart); //alternatively Cart.belongsTo(User) can be used with the same result
Cart.belongsToMany(Product, {through: CartItem}); // One Cart can hold multiple products 
Product.belongsToMany(Cart, {through: CartItem}); // A single product can be in multiple Carts
Order.belongsTo(User); //An order can only associated to one user
User.hasMany(Order); //An user can have multiple orders
Order.belongsToMany(Product, {through: OrderItem}); //An order is comprised by many products through order-item



sequelize
//.sync({force: true})
.sync()
.then(result => {
    return User.findByPk(1);
    //console.log("The result: " + result);  
})
.then(user => {
    if(!user){
        return User.create({name: 'Ale', email: 'alejandrohdezclemente@gmail.com'});
    }
    return Promise.resolve(user);
})
.then(user => {
    //console.log(user);
    return user.createCart();
    
})
.then(cart => {
    app.listen(3000);
})
.catch(err => {
    if(err){
        console.log(err);     
    }    
});

