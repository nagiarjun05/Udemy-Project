const path = require('path');
const express = require('express');
const cors= require('cors');
const app = express();

const dotenv=require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');

const User=require('./models/User');

const sequelize =require('./util/database')
const errorController = require('./controllers/error');



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
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
// const Restaurant=require('./models/Restaurant');
// const Review=require('./models/Review');
// const UserReview=require('./models/res-rev-user');

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

app.use((req, res)=>{
    console.log(req.url)
    res.sendFile(path.join(__dirname,`public/index.html`))
})

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
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through: OrderItem});
// User.belongsTo(Review);
// Restaurant.hasMany(Review)
// Review.belongsToMany(User,{through: UserReview})

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

