const { test, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const { app, mongoose } = require('../backend/app')

const api = supertest(app)

test('GET / returns 200', async () => {
  await api
    .get('/api')
    .expect(200)
})

after(async () => {
  await mongoose.connection.close()
})