const express = require('express')
const UserRoute = express.Router()
const  bcrypt = require('bcryptjs');
const UserModel = require('../models/user_model');
var salt = bcrypt.genSaltSync(10);

UserRoute.post('/login', (req, res)=>{
  UserModel.findOne({email: req.body.email}, (err, result)=>{
    if(bcrypt.compareSync(req.body.password, result.password)){
      res.status(200).send({
        message: 'Successfully logged in',
      })
    } else {
      res.status(401).send({
        message: 'Something Wrong'
      })
    }
  })
})
UserRoute.post('/register', (req, res)=>{
  const password = bcrypt.hashSync(req.body.password, salt);
  const User = new UserModel({
    email: req.body.email, 
    password: password, 
  })
  User.save((err, result)=>{
    if(!err){
      res.send({mesage: 'registered', result})
    }else{
      console.log(err)
    }
  })
})

module.exports = UserRoute