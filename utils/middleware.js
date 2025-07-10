const logger = require('./logger')

const requestLogs = (request, response, next) => {
  logger.error('------------------------------')
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.error('-------------------------------')
  next()
}

module.exports = {requestLogs}