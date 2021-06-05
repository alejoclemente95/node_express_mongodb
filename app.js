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
const mongoClient = require('./util/database');
const User = require('./models/user');

//The following function is just registered, it won't execute with the npm start 
//it will trigger only with incoming requests 
app.use((req,res,next) => {
    User.findById('60b8d16f85aae1a7df1743d2')
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();        
    })
    .catch(err => console.log(err));
});


app.use(express.static(path.join(__dirname, 'public')));

app.use(parser.urlencoded({extended: false}));

app.use(adminRoutes);
app.use(shopRoutes);

app.use(errorController.notFoundPage);


mongoClient.mongoConnect(() => {
    
    app.listen(3000);
})



