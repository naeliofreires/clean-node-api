import request from 'supertest'
import app from '../../app'

describe('CORS Middleware', () => {
  test('Should have the correct values related to CORS', async () => {
    app.get('/test-cors', async (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test-cors')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      .expect('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  })
})
