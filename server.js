// ========== Import ==========
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const UserRoute = require('./routes/user_route')
const CartRoute = require('./routes/cart_route')
const ConfigRoute = require('./routes/config_route')
require('dotenv').config()

// ========== Declare Variable ========== 
const app = express()
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL

// ========== Use Middleware ========== 
app.use(cors())
app.use(bodyParser.json())
app.use('/user', UserRoute)
app.use('/cart', CartRoute)
app.use('/config', ConfigRoute)

// ========== DB Connection ========== 

mongoose.connect(DB_URL, ()=>{
  console.log('Database Connected')
});


app.listen(PORT, ()=>{
  console.log('Server is running with Port '+PORT)
})