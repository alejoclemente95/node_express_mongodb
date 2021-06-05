const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect(
        'mongodb+srv://speedyRideApp:Alejandro95@speedyrcluster.j94zk.mongodb.net/shop?retryWrites=true&w=majority'
        , { useUnifiedTopology: true })
        .then(client => {
            console.log('connected to the MongoDB cluster');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDb = () => {
    if(_db){
        return _db;
    }
    throw  "No database found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;