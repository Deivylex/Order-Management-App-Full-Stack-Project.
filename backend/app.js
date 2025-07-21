require('express-async-errors')
const express = require('express')
const path = require('path')
const appRoutes = require('./controller/appRoutes')
const middleware = require('./utils/middleware')
const cors = require('cors');
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const userRoutes = require('./controller/user')
const loginRoute = require('./controller/login')
const orderRoute = require('./controller/order')

const app = express()
app.use(express.json())
logger.info(`Connecting to MongoDB url ${config.mongoUrl}...`)
mongoose.set('strictQuery',false)
mongoose.connect(config.mongoUrl)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error('MongoDB connection error:', err))
app.use(cors())
app.use(middleware.requestLogs)

app.use('/api/flights', appRoutes)
app.use('/api/users', userRoutes)
app.use('/api/login', loginRoute)
app.use('/api/order', orderRoute)

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  } else {
    res.status(404).json({ error: 'API endpoint not found' })
  }
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app