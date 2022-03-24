const express = require('express')
const CartRoute = express.Router()

CartRoute.get('/', (req, res)=>{
  res.send('cart')
})

module.exports = CartRoute