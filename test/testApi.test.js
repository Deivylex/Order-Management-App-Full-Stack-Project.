const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const { app, mongoose } = require('../backend/app')
const User = require('../backend/models/user')
const helper = require('./test_helper')

const api = supertest(app)

test('GET / returns 200 status code (homepage)', async () => {
  await api
    .get('/')
    .expect(200)
})

test('Login with valid credentials, should return 200 and provide a valid token', async () => {
  // First create a user for login
  const userToCreate = {
    email: 'testuser@example.com',
    name: 'Test User',
    password: 'validpassword123'
  }
  
  await api
    .post('/api/users')
    .send(userToCreate)
    .expect(201)

  const user = {
    email: userToCreate.email,
    password: userToCreate.password
  }
  
  const res = await api
                .post('/api/login')
                .send(user)
                .expect(200)
                .expect('Content-Type', /application\/json/)
  
  assert(res.body.token, 'Token should be present in response')
  assert.strictEqual(res.body.email, user.email)
  assert(res.body.userId)
  assert(res.body.name)
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

describe('User API tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    // Create initial users for testing
    for (const user of helper.initialUsers) {
      await api
        .post('/api/users')
        .send(user)
    }
  })

  describe('POST /api/users - User creation', () => {
    test('should create a new user with valid data', async () => {
      const newUser = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'validpassword123'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAfter = await helper.usersInDB()
      assert.strictEqual(usersAfter.length, helper.initialUsers.length + 1)

      const emails = usersAfter.map(user => user.email)
      assert(emails.includes(newUser.email))

      // Check that password is not returned
      assert(!response.body.passwordhash)
    })

    test('should fail with status 400 if password is missing', async () => {
      const newUser = {
        email: 'test@example.com',
        name: 'Test User'
        // password missing
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAfter = await helper.usersInDB()
      assert.strictEqual(usersAfter.length, helper.initialUsers.length)
    })

    test('should fail with status 400 if password is too short', async () => {
      const newUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: '12' // too short
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(response.body.error.includes('password must be at least 3 characters long'))

      const usersAfter = await helper.usersInDB()
      assert.strictEqual(usersAfter.length, helper.initialUsers.length)
    })

    test('should fail with status 400 if email is not unique', async () => {
      const newUser = {
        email: helper.initialUsers[0].email, // duplicate email
        name: 'Duplicate User',
        password: 'validpassword123'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAfter = await helper.usersInDB()
      assert.strictEqual(usersAfter.length, helper.initialUsers.length)
    })

    test('should set default role to "user"', async () => {
      const newUser = {
        email: 'roletest@example.com',
        name: 'Role Test User',
        password: 'validpassword123'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)

      const usersAfter = await helper.usersInDB()
      const createdUser = usersAfter.find(user => user.email === newUser.email)
      assert.strictEqual(createdUser.role, 'user')
    })
  })

  describe('DELETE /api/users/:id - User deletion', () => {
    test('should delete user with valid token and correct user', async () => {
      const usersAtStart = await helper.usersInDB()
      const userToDelete = usersAtStart[0]
      
      const token = await helper.getValidToken(userToDelete.email)

      await api
        .delete(`/api/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const usersAfter = await helper.usersInDB()
      assert.strictEqual(usersAfter.length, usersAtStart.length - 1)

      const emails = usersAfter.map(user => user.email)
      assert(!emails.includes(userToDelete.email))
    })

    test('should fail with status 404 if user does not exist', async () => {
      const nonExistentId = await helper.nonExistingId()
      const token = await helper.getValidToken()

      await api
        .delete(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })

    test('should fail with status 400 if id is invalid', async () => {
      const invalidId = 'invalid-id'
      const token = await helper.getValidToken()

      await api
        .delete(`/api/users/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    test('should fail with status 401 if token is missing', async () => {
      const usersAtStart = await helper.usersInDB()
      const userToDelete = usersAtStart[0]

      await api
        .delete(`/api/users/${userToDelete.id}`)
        .expect(401)
    })

    test('should fail with status 401 if token is invalid', async () => {
      const usersAtStart = await helper.usersInDB()
      const userToDelete = usersAtStart[0]

      await api
        .delete(`/api/users/${userToDelete.id}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
    })

    test('should fail with status 401 if user tries to delete another user', async () => {
      const usersAtStart = await helper.usersInDB()
      const userToDelete = usersAtStart[0]
      const anotherUser = usersAtStart[1]
      
      const token = await helper.getValidToken(anotherUser.email)

      await api
        .delete(`/api/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)

      const usersAfter = await helper.usersInDB()
      assert.strictEqual(usersAfter.length, usersAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})