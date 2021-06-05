// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user' , {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     }, 
//     name : {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     email : {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

// module.exports = User;

const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
    constructor(username, email, cart, id){
        this.username = username;
        this.email = email;
        this.cart = cart; // Object with the following structure {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));

}

    addToCart(product){
        
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
          });
          let newQuantity = 1;
          const updatedCartItems = [...this.cart.items];
      
          if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
          } else {
            updatedCartItems.push({
              productId: new mongodb.ObjectId(product._id),
              quantity: newQuantity
            });
          }
          const updatedCart = {
            items: updatedCartItems
          };
          const db = getDb();
          return db
            .collection('users')
            .updateOne(
              { _id: new mongodb.ObjectId(this._id) },
              { $set: { cart: updatedCart } }
            );

    }

    deleteProductById(productId){
        const db = getDb();

        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        })

        console.log(updatedCartItems);

        return db
            .collection('users')
            .updateOne(
              { _id: new mongodb.ObjectId(this._id) },
              { $set: { cart: {items: updatedCartItems} } }
            );
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => { //This will create an array with just the productIds
            return i.productId;
        })
        return db.collection('products').find({ _id: { $in: productIds}}).toArray()
        .then(products => {
            return products.map( p => {
                return {
                    ...p, //this will spread all the properties of the product, so each item will contain everything plus the quantity
                    quantity: this.cart.items.find(pc => {
                        return pc.productId.toString() === p._id.toString();
                    }).quantity
                };
            });
        })
        .catch(err => console.log(err));

    }

    addOrder() {
        const db = getDb();
        return this.getCart().then(products => {
            
            const order = {
                items: products,
                user: {
                    _id: new mongodb.ObjectID(this._id),
                    name: this.username,
                    email: this.email
                }
            };

            return db.collection('orders').insertOne(order)
                .then(result => {
                    this.cart = { items: [] };
                    return db
                        .collection('users')
                        .updateOne(
                            { _id: new mongodb.ObjectId(this._id) },
                            { $set: { cart: { items: [] } } }
                        );
                })
                .catch(err => console.log(err));
        })        
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({
            'user._id': new mongodb.ObjectID(this._id)
        }).toArray()
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(userId)})
        .then(user => {
            console.log('the user found from DB: ', user);
            return user;
        })
        .catch(err => console.log(err));
    }


}


module.exports = User;