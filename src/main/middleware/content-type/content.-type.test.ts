import request from 'supertest'
import app from '../../app'

describe('Content Type Middleware', () => {
  test('Should return content type as json', async () => {
    app.get('/test-content-type-json', async (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test-content-type-json')
      .expect('Content-Type', /json/)
  })

  test('Should return content type as xml', async () => {
    app.get('/test-content-type-xml', async (req, res) => {
      res.type('xml')
      res.send()
    })

    await request(app)
      .get('/test-content-type-xml')
      .expect('Content-Type', /xml/)
  })
})
