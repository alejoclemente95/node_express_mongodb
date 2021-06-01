const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('node-complete', 'root', 'root1234', {
    dialect: 'mysql',
    host: 'localhost',
    //logging: false
});

module.exports = sequelize;