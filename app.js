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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/users',userRoutes);
app.use('/expenses',expenseRoutes);

app.use(errorController.get404);

sequelize.sync().then(result=>{
    app.listen(3000);
    })
    .catch(err=>{
        console.log(err)
    });

