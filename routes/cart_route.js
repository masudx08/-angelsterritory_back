const express = require('express')
const mongoose = require('mongoose')
const Binance = require('node-binance-api');
const CartModel = require('../models/cart_model')
const CartRoute = express.Router()
const binance = new Binance()
// ============ Generate Cart ==============

const OneMinute = 1000*60
const FiveMinute = 1000*60*5
const FifteenMinute = 1000*60*15
const HalfHour = 1000*60*30
const OneHour = 1000*60*60
const OneDay = 1000*60*60*24

let btcPrice 
CartRoute.get('/', (req, res)=>{
  CartModel.find().exec((err, result)=>{
    console.log(result)
    res.send(result)
  })
  
})

// binance.futuresMiniTickerStream( 'BTCUSDT', (res)=>{
//   btcPrice = res.close
//   console.log(res)
// } );

// One Minute Generate 
var currentId 
setInterval(()=>{
  binance.futuresMarkPrice("BTCUSDT")
  .then(btc=>{
    const Cart = new CartModel({
      currency: 'BTC',
      activeTime: OneMinute,
      startTime: new Date(),
      lockedPrice: btc.indexPrice
    })

    Cart.save(function(err, res){
      if(err){
        console.log(err)
      }else{
        const id = res._id+''
        currentId = id
        console.log('saved')
      }
    })

    if(currentId){
      const filter = {_id:currentId}
      const update = {
        stopTime: new Date(),
        closedPrice: btc.indexPrice
      }
      CartModel.findOneAndUpdate(filter, update)
      .then(res=>{
        console.log('updated')
      })
    }

  })
  
  
  
},OneMinute)


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