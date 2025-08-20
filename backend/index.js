const logger = require('./utils/logger')
const { app } = require('./app')
const config = require('./utils/config')

app.listen(config.port, () => {
    logger.info(`Serve is running in port ${config.port}`)
})