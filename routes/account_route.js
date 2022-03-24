const express = require('express')
const AccountRoute = express.Router()

AccountRoute.get('/', (req, res)=>{
  res.send('account')
})

module.exports = AccountRoute