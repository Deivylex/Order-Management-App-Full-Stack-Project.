const loginRoute = require('express').Router()
const user = require('../models/user')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { error } = require('../utils/logger')

loginRoute.post('/', async(req, res) => {
    const username = req.body.username
    const password = req.body.password

    const responseDb = await user.findOne({username})
    const valPassword = await bcrypt.compare(password, responseDb.passwordhash)
    if(!responseDb || !valPassword){
        return res.status(401).json({error: "invalid user"})
    }
    res.status(200).json({username: responseDb.username, userId: responseDb.id})
})

module.exports = loginRoute