import express from 'express'
import setupMiddleware from '../middleware/setup'

const app = express()

setupMiddleware(app)

export default app
