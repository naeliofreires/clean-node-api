import { MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './sign-up-controller'
import { type AddAccountModel, type AddAccount } from '../../../domain/use-cases/add-account'
import { type AccountModel } from '../../../domain/models/account-model'
import { type Validation } from '../../protocols/validation'
import { badRequest } from '../../helpers/http-helper'

/**
 * Notes
 * SUT: System Under Test
 */
interface Instances {
  readonly sut: SignUpController
  readonly validatorStub: Validation
  readonly addAccountStub: AddAccount
}

/**
 * Factory for creating an AddAccountStub.
 *
 * @returns {AddAccount} A stub implementation of AddAccount.
 */
function makeAddAccount (): AddAccount {
  class AddAccountStub implements AddAccount {
    async add (_data: AddAccountModel): Promise<AccountModel> {
      const fake = {
        id: 1,
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }

      return await new Promise(resolve => { resolve(fake) })
    }
  }

  return new AddAccountStub()
}

function makeValidator (): Validation {
  class ValidatorStub implements Validation {
    validate (_input: any): Error {
      return null
    }
  }

  return new ValidatorStub()
}
/**
 * Factory for creating an instance of SignUpController.
 *
 * @returns {Instances} An object containing the SUT and dependencies.
 */
export function makeSut (): Instances {
  const addAccountStub = makeAddAccount()
  const validatorStub = makeValidator()
  const sut = new SignUpController(addAccountStub, validatorStub)

  return {
    sut,
    validatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with valid values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addAccountSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'valid@email.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    await sut.handle(httpRequest)
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'valid@email.com',
      password: 'password'
    })
  })

  test('Should return 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(async () => {
        return await new Promise((_resolve, reject) => {
          reject(new Error())
        })
      })

    const httpRequest = {
      body: {
        name: 'name',
        email: 'valid@email.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if addAccount has valid data', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmPassword: 'valid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 1,
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })
  })

  test('Should call the validate with the correct params', async () => {
    const { sut, validatorStub } = makeSut()

    const validatorSpy = jest.spyOn(validatorStub, 'validate')

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmPassword: 'valid_password'
      }
    }

    await sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledTimes(1)
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if if validation returns an error', async () => {
    const { sut, validatorStub } = makeSut()

    jest
      .spyOn(validatorStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any'))

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmPassword: 'valid_password'
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('any')))
  })
})
