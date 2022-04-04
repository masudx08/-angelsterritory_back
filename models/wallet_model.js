const mongoose  = require('mongoose')

const walletSchema = mongoose.Schema({
  email: String,
  BTC: Number,
  ETH: Number,
  USDT: Number
})

const WalletModel = mongoose.model('Wallet', walletSchema)
module.exports = WalletModel