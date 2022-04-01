require('dotenv').config()
const express = require('express')
const UserRoute = express.Router()
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user_model');
const { authorizer } = require('../middleware/middleware');
var salt = bcrypt.genSaltSync(10);

UserRoute.get('/', authorizer, (req,res)=>{
  UserModel.findOne({_id:req.user.id},{password:0}, (err, result)=>{
    if(!err){
      res.send(result)
    }else{
      res.sendStatus(403)
    }
  })
})

UserRoute.post('/login', (req, res)=>{
  UserModel.findOne({email: req.body.email}, (err, result)=>{
    if(bcrypt.compareSync(req.body.password, result.password)){
      const jwtAccessToken = jwt.sign({ email: result.email, id:result._id, role: result.role}, process.env.JWT_SECRET)
      res.status(200).send({
        message: 'Successfully logged in',
        jwtAccessToken: 'Bearer '+jwtAccessToken
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
    role: 'user'
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