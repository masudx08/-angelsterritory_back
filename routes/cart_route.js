const express = require('express')
const mongoose = require('mongoose')
const Binance = require('node-binance-api');
const { authorizer } = require('../middleware/middleware');
const CartModel = require('../models/cart_model');
const historyModel = require('../models/history_model');
const WalletModel = require('../models/wallet_model');
const CartRoute = express.Router()
const binance = new Binance()
// ============ Generate Cart ==============

const OneMinute = 1000*60
const FiveMinute = 1000*60*5
const FifteenMinute = 1000*60*15
const HalfHour = 1000*60*30
const OneHour = 1000*60*60
const OneDay = 1000*60*60*24
function cartSocket(io){
  io.on('connection', socket=>{
    binance.futuresMiniTickerStream('BTCUSDT', ticker=>{
      socket.emit('btcStream', ticker)
    });
  })
}

CartRoute.post('/:id', authorizer, (req, res)=>{
  if(req.body.upPool){
    CartModel.findOne({_id:req.params.id}, function(err, result){
      const history = new historyModel({
        contestId : req.params.id,
        type: 'trade',
        status: 'live',
        date: new Date(),
        contractType: '1Min',
        amount: req.body.upPool,
        currency: 'BTC',
        fee: 1,
        feeCurrency: 'USDT',
        cart: req.params.id,
        user: req.user.id,
      })
      result.upPool = Number(req.body.upPool) + Number(result.upPool)
      result.save(()=>{
        res.status(200).send({message:'done'})
        WalletModel.findOne({email: req.user.email})
        .then(wallet=>{
          wallet.USDT = wallet.USDT - req.body.upPool
          wallet.save()
        })
        history.save((err, response)=>{
          console.log('history saved')
        })

      })
    })
  }

  if(req.body.downPool){
    CartModel.findOne({_id:req.params.id}, function(err, result){
      const history = new historyModel({
        contestId : req.params.id,
        type: 'trade',
        status: 'live',
        date: new Date(),
        contractType: '1Min',
        amount: req.body.upPool,
        currency: 'BTC',
        fee: 1,
        feeCurrency: 'USDT',
        cart: req.params.id,
        user: req.user.id,
      })
      result.downPool = Number(req.body.downPool) + Number(result.downPool)
      result.save(()=>{
        res.status(200).send({message:'done'})
        WalletModel.findOne({email: req.user.email})
        .then(wallet=>{
          wallet.USDT = wallet.USDT - req.body.downPool
          wallet.save()
        })
        history.save((err, response)=>{
          console.log('history saved')
        })
      })
    })
  }
})

let io

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
// setInterval(()=>{
//   generateCart({
//     currency : 'BTC',
//     activeTime: OneMinute
//   })
//   generateCart({
//     currency : 'ETH',
//     activeTime: OneMinute
//   })
//   generateCart({
//     currency : 'BNB',
//     activeTime: OneMinute
//   })
// },OneMinute)


// setInterval(()=>{},FiveMinute)

// setInterval(()=>{},FifteenMinute

// setInterval(()=>{},HalfHour)

// setInterval(()=>{},OneHour)

// setInterval(()=>{},OneDay)

  

// CartModel.find().$where(function(){
//   return this.totalPool > 100 && this.lockedPrice == 35
// })
// .then (res=>{
//   console.log(res)
// })


module.exports = {CartRoute, cartSocket}
