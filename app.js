const express = require('express')
const appRoutes = require('./controller/appRoutes')
const middleware = require('./utils/middleware')

const app = express()

app.use(middleware.requestLogs)
app.use(express.json())
app.use(appRoutes)

module.exports = app