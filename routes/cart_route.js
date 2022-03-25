const express = require('express')
const mongoose = require('mongoose')
const CartModel = require('../models/cart_model')
const CartRoute = express.Router()
// ============ Generate Cart ==============

const OneMinute = 1000*60
const FiveMinute = 1000*60*5
const FifteenMinute = 1000*60*15
const HalfHour = 1000*60*30
const OneHour = 1000*60*60
const OneDay = 1000*60*60*24

CartRoute.get('/', (req, res)=>{
  CartModel.find().exec((err, result)=>{
    console.log(result)
    res.send(result)
  })
  
})

function generateCart(currency, activeTime){
  const Cart = new CartModel({
    currency,
    activeTime,
    totalPool: 0,
    startTime: new Date(),
    lockedPrice: 0,
    closedPrice: 0,
    upPool: 0,
    downPool: 0,
    upPayout: 0,
    downPayout: 0
  })
  Cart.save(err=>{
    if(err){
      console.log(err)
    }
  })
}

// setInterval(()=>{
  
// },OneMinute)


// setInterval(()=>{},FiveMinute)

// setInterval(()=>{},FifteenMinute)


// setInterval(()=>{},HalfHour)

// setInterval(()=>{},OneHour)

// setInterval(()=>{},OneDay)

  

// CartModel.find().$where(function(){
//   return this.totalPool > 100 && this.lockedPrice == 35
// })
// .then (res=>{
//   console.log(res)
// })


module.exports = CartRoute