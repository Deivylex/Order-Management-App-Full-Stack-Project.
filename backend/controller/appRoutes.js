const appRoutes = require('express').Router()
const axios = require('axios')
const logger = require('../utils/logger')
const path = require('path')
const fs = require('fs')
const middleware = require('../utils/middleware')

appRoutes.get('/test', middleware.userExtractor, async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../../data_20k.json')
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        
        const paginatedData = data.slice(startIndex, endIndex)
        
        const totalClients = data.length
        const totalPages = Math.ceil(totalClients / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1
        
        res.json({
            clients: paginatedData,
            pagination: {
                currentPage: page,
                totalPages,
                totalClients,
                limit,
                hasNextPage,
                hasPrevPage
            }
        })
    } catch (error) {
        console.error('Error loading clients:', error)
        res.status(500).json({ error: 'Failed to load clients' })
    }
})

module.exports = appRoutes