const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const User=require('./models/User');

const sequelize =require('./util/database')
const errorController = require('./controllers/error');

const cors= require('cors');

const app = express();

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/users',userRoutes);
app.use('/expenses',expenseRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{ constraints: true, onDelete:"CASCADE"});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through: CartItem});
Product.belongsToMany(Cart,{through: CartItem});



sequelize
.sync()
// .sync({force: true})
.then((result)=>{
    return User.findByPk(1);
})
.then((user)=>{
    if(!user){
        return User.create({name:'Arjun',email:'arjun@gmail.com',phonenumber:'9998885225'})
    }
    return user
})
.then(user=>{
    return user.createCart()
})
.then(cart=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err)
});

