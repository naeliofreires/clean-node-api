import express from 'express'
import setupMiddleware from '../middleware/setup'
import setupRoutes from '../routes/setup'

const app = express()

setupMiddleware(app)
setupRoutes(app)

export default app
