const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const logger = require('../utils/logger')

describe ("Authentication Test", () => {
  test('signup user', async () => {
    let payload = {
      username: 'authTester2',
      email: 'authtester@masive.com',
      password: 'test'
    }

    await api
      .post('/api/auth/signup')
      .send(payload)
      .set("Accept", "application/json")
      .expect(response => logger.info(response))
      .expect(200)
  }, 100000)

  test.only('sigin user', async () => {
    let payload = {
      email: 'authtester@masive.com',
      password: 'test'
    }

    await api
      .post('/api/auth/signin')
      .send(payload)
      .set("Accept", "application/json")
      .expect(response => logger.info(response))
      .expect(200)
  }, 50000)

  afterAll(() => {
    mongoose.connection.close()
  })
})