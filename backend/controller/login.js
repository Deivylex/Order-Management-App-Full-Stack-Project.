const loginRoute = require('express').Router()
const user = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

const generatePassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

loginRoute.post('/', async(req, res) => {
    const email = req.body.email
    const password = req.body.password

    const responseDb = await user.findOne({email})
    const valPassword = await bcrypt.compare(password, responseDb.passwordhash)
    if(!responseDb || !valPassword){
        return res.status(401).json({error: "invalid user"})
    }
    const userToken = {
        email: email,
        id: responseDb.id
    }
    const token = jwt.sign(userToken, process.env.JWT_SECRET)
    res.status(200).json({
        email: responseDb.email, 
        userId: responseDb.id, 
        name: responseDb.name, 
        role: responseDb.role,
        token: token
    })
})

loginRoute.post('/auth', async(req, res) => {
    const body = req.body
    const existingUser = await user.findOne({email: body.email})
    if (existingUser)
    {
        const userToken = {
            email: existingUser.email,
            id: existingUser.id
        }
        const token = jwt.sign(userToken, process.env.JWT_SECRET)
        const userData = {
            email: existingUser.email,
            name: existingUser.name,
            id: existingUser.id,
            role: existingUser.role,
            token: token
        }
        return res.status(200).json(userData)
    }
    const saltRounds = 10
    const password = await bcrypt.hash(generatePassword(),saltRounds)
    const newUser = new user({
        email: body.email,
        name: body.name,
        passwordhash: password
    })
    const responseDb = await newUser.save()
    const userToken = {
        email: responseDb.email,
        id: responseDb.id
    }
    const token = jwt.sign(userToken, process.env.JWT_SECRET)
    const userData = {
        email: responseDb.email,
        name: responseDb.name,
        id: responseDb.id,
        role: responseDb.role,
        token: token
    }
    res.status(201).json(userData)
})

module.exports = loginRoute