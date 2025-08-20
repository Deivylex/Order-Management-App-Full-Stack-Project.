const path = require('path')
require('dotenv').config({ 
  path: path.join(__dirname, '../.env') 
})

const mongoUrl = process.env.MONGODB_URI

const port = process.env.PORT || 3000

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined

module.exports = { port, mongoUrl, isDevelopment }