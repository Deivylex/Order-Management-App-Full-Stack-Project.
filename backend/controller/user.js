const userRoute = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRoute.post('/', async(req, res) => {
    const body = req.body
    console.log("body",body)
    if (!body.password || body.password < 3){
        return res.status(400).json({error: 'password must be at least 3 characters long'})
    }
    const saltRounds = 10
    const password = await bcrypt.hash(body.password,saltRounds)
    const newUser = new User({
        username: body.username,
        name: body.name,
        passwordhash: password
    })
    const responseDb = await newUser.save()
    res.status(201).json(responseDb)
})

module.exports = userRoute