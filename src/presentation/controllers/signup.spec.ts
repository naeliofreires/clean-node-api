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

  test('Should return 400 if no password is provided', () => {
    const stu = new SignUpController()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: undefined,
        confirmPassword: 'password'
      }
    }

    const httpResponse = stu.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no confirmPassword is provided', () => {
    const stu = new SignUpController()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: 'password',
        confirmPassword: undefined
      }
    }

    const httpResponse = stu.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword'))
  })
})
