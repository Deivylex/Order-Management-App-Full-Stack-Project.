const logger = require('./logger')
const jwt = require('jsonwebtoken')
const users = require('../models/user')

const requestLogs = (request, response, next) => {
  logger.error('------------------------------')
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.error('-------------------------------')
  next()
}

const antiSpamMiddleware = (req, res, next) => {
  const userAgent = req.get('User-Agent');
  const ip = req.ip;
  
  const suspiciousAgents = ['curl', 'wget', 'python-requests', 'bot'];
  if (suspiciousAgents.some(agent => userAgent?.toLowerCase().includes(agent))) {
    return res.status(403).json({ error: 'Automated requests not allowed' });
  }

  if (!req.get('referer') && !req.get('origin')) {
    return res.status(403).json({ error: 'Invalid request source' });
  }
  
  next();
};

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }
    const user = await users.findById(decodedToken.id)
    req.user = user
  } else {
    return res.status(401).json({ error: 'token is missing' })
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {requestLogs, errorHandler, unknownEndpoint, userExtractor, antiSpamMiddleware}