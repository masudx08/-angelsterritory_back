// ========== Import ==========
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const UserRoute = require('./routes/user_route')
const CartRoute = require('./routes/cart_route')
const ConfigRoute = require('./routes/config_route');
const HistoryRoute = require('./routes/history_route');
const { authorizer } = require('./middleware/middleware');
const WalletRoute = require('./routes/wallet_route');
require('dotenv').config()
const { createServer } = require("http")
const { Server } = require("socket.io");




// ========== Declare Variable ========== 
const app = express()
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL

// ========== Use Middleware ========== 
app.use(cors())
app.use(bodyParser.json())
app.use('/user', UserRoute)
app.use('/cart', CartRoute)
app.use('/history', HistoryRoute)
app.use('/wallet', WalletRoute)
app.use('/config', ConfigRoute)

// ========== DB Connection ========== 

mongoose.connect(DB_URL, ()=>{
  console.log('Database Connected')
});




const httpServer = createServer()
const io = new Server(httpServer,  {
  cors: {
    origin: "http://localhost:3000"
  }
});


io.on('connection', (socket)=>{
 socket.emit('wow', 'wow')
})



httpServer.listen(5000)
app.listen(PORT, ()=>{
  console.log('Server is running with Port '+PORT)
})