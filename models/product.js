
//The following code is intended to use with pure mysql2 dependency, not with sequelize, hence commenting it

// const rootDir = require('../util/path');

// const Cart = require('./cart');

// const db = require('../util/database');

// module.exports = class Product {
//     constructor(id,title, imageUrl, description, price){
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

//     save(editing){              
//         if(!editing){
//             return db.execute('INSERT into products (title,price,description,imageUrl) values(?,?,?,?)', 
//             [this.title, this.price, this.description, this.imageUrl]);
//         }else{
//             return db.execute('UPDATE products set title = ?, price = ?, description = ?, imageUrl = ? WHERE id = ?', 
//             [this.title, this.price, this.description, this.imageUrl, this.id]);
//         }
        
//     }

//     static deleteProduct(id){
        
//     }

//     static fetchAll(){        
//         return db.execute('SELECT * FROM products');        
//     }

//     static getProductDetail(id) {
//         return db.execute('SELECT * from products WHERE id = ?', [id]);
//     }

// }

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('products', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;

