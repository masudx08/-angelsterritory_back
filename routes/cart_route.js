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





CartRoute.post('/:id', (req, res)=>{
  if(req.body.upPool){
    CartModel.findOne({_id:req.params.id}, function(err, result){
      result.upPool = Number(req.body.upPool) + Number(result.upPool)
      result.save(()=>{
        res.status(200).send({message:'done'})
      })
    })
  }

  if(req.body.downPool){
    CartModel.findOne({_id:req.params.id}, function(err, result){
      result.downPool = Number(req.body.downPool) + Number(result.downPool)
      result.save(()=>{
        res.status(200).send({message:'done'})
      })
    })
  }
})

CartRoute.get('/', (req, res)=>{
  CartModel.find().exec((err, result)=>{
    res.send(result)
  })
})

function generateCart(props){
  binance.futuresMarkPrice(props.currency+"USDT")
  .then(coin=>{
    const Cart = new CartModel({
      currency: props.currency,
      activeTime: props.activeTime,
      startTime: new Date(),
      lockedPrice: coin.indexPrice,
      upPool: 0,
      downPool: 0
    })

    Cart.save(function(err, res){
      if(err){
        console.log(err)
      }else{
        const id = res._id+''
        console.log('saved')
        setTimeout(function(){
          if(id){
             binance.futuresMarkPrice(props.currency+"USDT")
             .then(coin2=>{
                CartModel.findOneAndUpdate({_id:id}, {
                  stopTime: new Date(),
                  closedPrice: coin2.indexPrice
                })
                .then(()=>{
                  console.log('updated')
                })
             })
            
            
          }
        }, props.activeTime)
      }
    })

  })

}

// One Minute Generate 
setInterval(()=>{
  generateCart({
    currency : 'BTC',
    activeTime: OneMinute
  })
  generateCart({
    currency : 'ETH',
    activeTime: OneMinute
  })
  generateCart({
    currency : 'BNB',
    activeTime: OneMinute
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