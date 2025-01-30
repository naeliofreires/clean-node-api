import { type Express } from 'express'
import { bodyParser } from './body-parser/body-parser'
import { cors } from './cors/cors'
import { contentType } from './content-type/content-type'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
