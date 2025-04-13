import { SignInController } from './sign-in-controller'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { type Authentication, type AuthenticationParams } from '../../../domain/use-cases/authentication'
import { type Validation } from '../../protocols/validation'

class AuthenticationStub implements Authentication {
  async auth(params: AuthenticationParams): Promise<string> {
    return 'any_token'
  }
}

class ValidationStub implements Validation {
  validate(_input: any): Error | null {
    return undefined
  }
}

const makeSut = (): {
  sut: SignInController
  authenticationStub: AuthenticationStub
  validationStub: ValidationStub
} => {
  const authenticationStub = new AuthenticationStub()
  const validationStub = new ValidationStub()

  const sut = new SignInController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('SignInController', () => {
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
    expect(authSpy).toHaveBeenCalledWith({
      email: 'email@gmail.com',
      password: '<PASSWORD>'
    })
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

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const request = {
      body: {
        email: 'email@gmail.com',
        password: '<PASSWORD>'
      }
    }

    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_value'))

    const response = await sut.handle({})
    expect(response).toEqual(badRequest(new MissingParamError('any_value')))
  })
})
