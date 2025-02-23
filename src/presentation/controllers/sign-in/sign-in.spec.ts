import { SignInController } from './sign-in-controller'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

const makeSut = (): { sut: SignInController } => {
  const sut = new SignInController()

  return {
    sut
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
})
