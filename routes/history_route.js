const express = require('express')
const historyModel = require('../models/history_model')
const HistoryRoute = express.Router()

HistoryRoute.get('/:id', (req,res)=>{
  historyModel.find({user:req.params.id}).populate('user').populate('cart')
  .exec((err, result)=>{
    res.send(result)
  })
})
HistoryRoute.get('/', (req,res)=>{
  historyModel.find().populate('user').populate('cart')
  .exec((err, result)=>{
    res.send(result)
  })
})

module.exports = HistoryRoute