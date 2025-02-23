import { SignInController } from './sign-in-controller'
import { badRequest, serverError } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { type EmailValidator } from '../sign-up/sign-up-protocols'

class EmailValidatorStub implements EmailValidator {
  isValid (): boolean {
    return true
  }
}

const makeSut = (): { sut: SignInController, emailValidatorStub: EmailValidatorStub } => {
  const emailValidatorStub = new EmailValidatorStub()

  const sut = new SignInController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
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
})
