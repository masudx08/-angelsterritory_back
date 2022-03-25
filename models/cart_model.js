const mongoose = require('mongoose')

const cartOptions = {
  toJSON : {
    virtuals : true
  }
}
const CartSchema = mongoose.Schema({
  currency: String,
  startTime: Date,
  lockedPrice: Number,
  closedPrice: Number,
  upPool: Number,
  downPool: Number,
  stopTime: Date
}, cartOptions)

CartSchema.virtual('totalPool').get(function(){
  return this.upPool + this.downPool
})
CartSchema.virtual('upPayout').get(function(){
 const fee = this.totalPool * 0.03
  return  (this.totalPool - fee)/ this.upPool
})
CartSchema.virtual('downPayout').get(function(){
  const fee = this.totalPool * 0.03
  return  (this.totalPool - fee)/ this.downPool
})

const CartModel = mongoose.model('Cart', CartSchema)

module.exports = CartModel