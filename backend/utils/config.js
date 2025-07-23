require('dotenv').config()

const mongoUrl = process.env.MONGODB_URI

const port = process.env.PORT || 3000

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined

module.exports = { port, mongoUrl, isDevelopment }