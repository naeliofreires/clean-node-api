import { type Router } from 'express'
import { makeSignupController } from '../factories/sign-up'
import adapter from './express-route-adapter'

export default (router: Router): void => {
  router.post('/sign-up', adapter(makeSignupController()))
}
