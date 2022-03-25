const mongoose = require('mongoose')

const CartSchema = mongoose.Schema({
  currency: String,
  startTime: Date,
  lockedPrice: Number,
  closedPrice: Number,
  upPool: Number,
  downPool: Number,
  stopTime: Date
})



const CartModel = mongoose.model('Cart', CartSchema)

module.exports = CartModel