const loginRoute = require('express').Router()
const user = require('../models/user')
const bcrypt = require('bcrypt')

loginRoute.post('/', async(req, res) => {
    const email = req.body.email
    const password = req.body.password

    const responseDb = await user.findOne({email})
    const valPassword = await bcrypt.compare(password, responseDb.passwordhash)
    if(!responseDb || !valPassword){
        return res.status(401).json({error: "invalid user"})
    }
    res.status(200).json({email: responseDb.email, userId: responseDb.id})
})

module.exports = loginRoute