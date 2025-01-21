import { SignUpController } from './SignUpController'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const stu = new SignUpController()
    const httpRequest = {
      body: {
        name: undefined,
        email: 'test@mail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const httpResponse = stu.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const stu = new SignUpController()
    const httpRequest = {
      body: {
        name: 'name',
        email: undefined,
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const httpResponse = stu.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
