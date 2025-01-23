import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './sign-up-controller'
import { type AddAccountModel, type AddAccount } from '../../../domain/use-cases/add-account'
import { type EmailValidator } from './sign-up-protocols'
import { type AccountModel } from '../../../domain/models/account-model'

/**
 * Notes
 * SUT: System Under Test
 */
interface Instances {
  readonly sut: SignUpController
  readonly addAccountStub: AddAccount
  readonly emailValidatorStub: EmailValidator
}

/**
 * Factory for creating an EmailValidatorStub.
 *
 * @returns {EmailValidator} A stub implementation of EmailValidator.
 */
function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

/**
 * Factory for creating an AddAccountStub.
 *
 * @returns {AddAccount} A stub implementation of AddAccount.
 */
function makeAddAccount (): AddAccount {
  class AddAccountStub implements AddAccount {
    add (data: AddAccountModel): AccountModel {
      return {
        id: 1,
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }
    }
  }

  return new AddAccountStub()
}

/**
 * Factory for creating an instance of SignUpController.
 *
 * @returns {Instances} An object containing the SUT and dependencies.
 */
export function getSignUpControllerInstance (): Instances {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    addAccountStub,
    emailValidatorStub
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

  test('Should return 400 if the password doesnt match', () => {
    const { sut } = getSignUpControllerInstance()

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@gmai.com',
        password: 'password',
        confirmPassword: 'password.'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('confirmPassword'))
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
    const { sut, emailValidatorStub } = getSignUpControllerInstance()

    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new Error() as any })

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

  test('Should call AddAccount with valid values', () => {
    const { sut, addAccountStub } = getSignUpControllerInstance()

    const addAccountSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'valid@email.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    sut.handle(httpRequest)
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'valid@email.com',
      password: 'password'
    })
  })
})
