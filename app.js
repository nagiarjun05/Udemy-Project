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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.post('/users/add-user', async (req, res)=>{
    console.log(req.body.name)
    console.log(req.body.email)
    console.log(req.body.phonenumber)
    try{
        if (!req.body.phonenumber){
            throw new Error("Phone Number is Mandatory");
        }
        const name=req.body.name;
        const email=req.body.email;
        const phonenumber=req.body.phonenumber;

        const data = await User.create({
            name: name,
            email: email,
            phonenumber: phonenumber
        });
        res.status(201).json({newUserDetail: data});
    } catch(err){
        res.status(500).json({
            error: err
        })
    }
});

app.get('/users/get-users', async (req, res)=>{
    try{
        const users = await User.findAll();
        res.status(200).json({allUsers: users});
    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
});

app.delete('/users/delete-user/:id',async (req, res)=>{
    const uId=req.params.id;
    await User.destroy({where:{id: uId}});
    res.sendStatus(200);
});


app.use(errorController.get404);

sequelize.sync().then(result=>{
    app.listen(3000);
    })
    .catch(err=>{
        console.log(err)
    });

