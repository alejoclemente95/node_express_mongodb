
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

//commenting as part of the migration from sequelize to mongodb on Jun 1, 2021
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Product = sequelize.define('products', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

// module.exports = Product;

//MongoDB implementation starts here

const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            //update the product
            dbOp = db.collection('products').updateOne({ _id: new mongodb.ObjectID(this._id) }, { $set: this });
        } else {
            //insert product
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => console.log(err));
    }

    static findById(productId){
        const db = getDb();
        return db.collection('products').find({ _id: new mongodb.ObjectID(productId) }).next()
        .then(product => {
            console.log(product);
            return product;
        }).catch(err => console.log(err));
    }

    static deleteProduct(productId) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectID(productId)})
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(`Error when trying to delete product with id ${productId}`, err));
    }

};

module.exports = Product;

