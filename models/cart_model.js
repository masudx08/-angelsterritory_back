const mongoose = require('mongoose')

const CartSchema = mongoose.Schema({
  currency: String,
  totalPool: Number,
  startTime: Date,
  lockedPrice: Number,
  closedPrice: Number,
  upPool: Number,
  downPool: Number,
  upPayout: Number,
  downPayout: Number
})



const CartModel = mongoose.model('Cart', CartSchema)

module.exports = CartModel