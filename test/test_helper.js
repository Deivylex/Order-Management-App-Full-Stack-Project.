const User = require('../backend/models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialUsers = [
  {
    email: 'testuser1@example.com',
    name: 'Test User 1',
    password: 'password123'
  },
  {
    email: 'testuser2@example.com',
    name: 'Test User 2', 
    password: 'password456'
  },
  {
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'adminpass123'
  }
]

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const nonExistingId = async () => {
  const user = new User({
    email: 'willremovethissoon@example.com',
    name: 'Temp User',
    passwordhash: await bcrypt.hash('temppass', 10)
  })
  
  await user.save()
  await user.deleteOne()
  
  return user._id.toString()
}

const getValidToken = async (email = initialUsers[0].email) => {
  // Find user in database or use first initial user
  const users = await usersInDB()
  const user = users.find(u => u.email === email) || users[0]
  
  if (!user) {
    throw new Error('No user found for token generation')
  }

  const userForToken = {
    email: user.email,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.JWT_SECRET)
  return token
}

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email })
  return user ? user.toJSON() : null
}

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'testpass123'
  }
  
  const userToCreate = { ...defaultUser, ...userData }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(userToCreate.password, saltRounds)
  
  const user = new User({
    email: userToCreate.email,
    name: userToCreate.name,
    passwordhash: passwordHash,
    role: userToCreate.role || 'user'
  })
  
  const savedUser = await user.save()
  return savedUser.toJSON()
}

module.exports = {
  initialUsers,
  usersInDB,
  nonExistingId,
  getValidToken,
  getUserByEmail,
  createTestUser
}
