// // const { Model } = require('sequelize');
// const User=require('../models/User');


// exports.addUser= async ()=>{
//     try{
//         if (!req.body.phonenumber){
//             throw new Error("Phone Number is Mandatory");
//         }
//         const name=req.body.name;
//         const email=req.body.email;
//         const phonenumber=req.body.phonenumber;

//         const data = await User.create({
//             name: name,
//             email: email,
//             phonenumber: phonenumber
//         });
//         res.status(201).json({newUserDetail: data});
//     } catch(err){
//         res.status(500).json({
//             error: err
//         });
//     };
// };

// exports.getUser=async ()=>{
//     const users = await User.findAll();
//     res.status(200).json({allUsers: users});
// };

// exports.deleteUser=async ()=>{
//     const uId=req.params.id;
//     await User.destroy({where:{id: uId}});
//     res.sendStatus(200);
// };
