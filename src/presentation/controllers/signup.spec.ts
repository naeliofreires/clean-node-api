import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { type EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './SignUpController'

/**
 * Notes
 * SUT: significa System Under Test
 */
interface Instances {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

export function getSignUpControllerInstance (): Instances {
  class EmailValidatorStub implements EmailValidator {
    isValid (_email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()

  return {
    emailValidatorStub,
    sut: new SignUpController(emailValidatorStub)
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = getSignUpControllerInstance()
    const httpRequest = {
      body: {
        name: undefined,
        email: 'test@mail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = getSignUpControllerInstance()
    const httpRequest = {
      body: {
        name: 'name',
        email: undefined,
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = getSignUpControllerInstance()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: undefined,
        confirmPassword: 'password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no confirmPassword is provided', () => {
    const { sut } = getSignUpControllerInstance()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: 'password',
        confirmPassword: undefined
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = getSignUpControllerInstance()

    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockReturnValue(false)

    const httpRequest = {
      body: {
        name: 'name',
        email: 'invalida@email.',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = getSignUpControllerInstance()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@gmail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('email@gmail.com')
  })

  test('Should return 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (_email: string): boolean {
        throw new Error()
      }
    }

    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)

    const httpRequest = {
      body: {
        name: 'name',
        email: 'invalida@email.',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
