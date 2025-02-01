import request from 'supertest'
import app from '../app'

describe('SignUp Routes', () => {
  test('Should return status 200', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Loki',
        email: 'lopis@gmail.com',
        password: 123,
        passwordConfirmation: 123
      })
      .expect(200)
  })
})
