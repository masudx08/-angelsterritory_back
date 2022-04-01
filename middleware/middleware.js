require('dotenv').config()
const jwt = require('jsonwebtoken')

function authorizer(req, res, next){
  const token = req.headers.token.split(' ')[1]
  const user = jwt.verify(token, process.env.JWT_SECRET)
  req.user = user
  next()
}

module.exports = {authorizer}