const { test, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const { app, mongoose } = require('../backend/app')

const api = supertest(app)

test('GET / returns 200 status code (homepage)', async () => {
  await api
    .get('/')
    .expect(200)
})

test('Login with valid credentials, should return 200 and provide a valid token', async () => {
  const user = {
    email : 'guest',
    password : 'guest'
  }
  const res = await api
                .post('/api/login')
                .send(user)
                .expect(200)  
  assert(res.body.token, 'Token should be present in response')
})

test('Login with invalid credentials, should return 401', async () => {
  const user = {
    email : 'invalidUser',
    password : 'invalidUser'
  }
  const res = await api
                .post('/api/login')
                .send(user)
                .expect(401)  
  assert(!res.body.token, 'Token should not be present in response')
})

after(async () => {
  await mongoose.connection.close()
})