import { SignInController } from './sign-in-controller'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { type EmailValidator } from '../sign-up/sign-up-protocols'
import { type Authentication } from '../../../domain/use-cases/authentication'

class EmailValidatorStub implements EmailValidator {
  isValid (): boolean {
    return true
  }
}

class AuthenticationStub implements Authentication {
  async auth (): Promise<string> {
    return 'any_token'
  }
}

const makeSut = (): { sut: SignInController, emailValidatorStub: EmailValidatorStub, authenticationStub: AuthenticationStub } => {
  const emailValidatorStub = new EmailValidatorStub()
  const authenticationStub = new AuthenticationStub()

  const sut = new SignInController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

describe('SignInController', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const request = {
      body: {
        password: '<PASSWORD>'
      }
    }

    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const request = {
      body: {
        email: 'email@gmail.com'
      }
    }

    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call email validator with correct params', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const validatorSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const request = {
      body: {
        email: 'email@gmail.com',
        password: '<PASSWORD>'
      }
    }

    await sut.handle(request)
    expect(validatorSpy).toHaveBeenCalledTimes(1)
    expect(validatorSpy).toHaveBeenCalledWith('email@gmail.com')
  })

  test('Should return bad-request if email is not valid', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)

    const request = {
      body: {
        email: 'email@gmail.com',
        password: '<PASSWORD>'
      }
    }

    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new Error() })

    const request = {
      body: {
        email: 'email@gmail.com',
        password: '<PASSWORD>'
      }
    }

    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should call auth with correct params', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    const request = {
      body: {
        email: 'email@gmail.com',
        password: '<PASSWORD>'
      }
    }

    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledTimes(1)
    expect(authSpy).toHaveBeenCalledWith('email@gmail.com', '<PASSWORD>')
  })

  test('Should return 401 if auth failed', async () => {
    const { sut, authenticationStub } = makeSut()

    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => { resolve(null) }))

    const request = {
      body: {
        email: 'email@gmail.com',
        password: '<PASSWORD>'
      }
    }

    const response = await sut.handle(request)
    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if auth throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((_resolve, reject) => { reject(new Error()) }))

    const request = {
      body: {
        email: 'email@gmail.com',
        password: '<PASSWORD>'
      }
    }

    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 if credentials is valid', async () => {
    const { sut } = makeSut()

    const request = {
      body: {
        email: 'email@gmail.com',
        password: '<PASSWORD>'
      }
    }

    const response = await sut.handle(request)
    expect(response).toEqual(ok({ accessToken: 'any_token' }))
  })
})
