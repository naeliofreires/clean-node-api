import request from 'supertest'
import app from '../../app'

describe('Body Parser Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ any: 'test' })
      .expect(200)
      .expect({ any: 'test' })
  })
})
