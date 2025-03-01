import { type EmailValidator } from '../../protocols/email-validator'
import { EmailFieldValidation } from './email-field-validation'

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

export function makeSut (): any {
  const emailValidatorStub = makeEmailValidatorStub()
  const emailFieldValidation = new EmailFieldValidation('email', emailValidatorStub)

  return { sut: emailFieldValidation, emailValidatorStub }
}

describe('Email Field Validation', () => {
  test('Should invoke EmailValidator with the provided email during validation process', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const emailFieldValidationSpy = jest.spyOn(sut, 'validate')
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@gmail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    sut.validate({ email: httpRequest.body.email })

    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email)
    expect(emailFieldValidationSpy).toHaveBeenCalledWith({ email: httpRequest.body.email })
  })

  test('Should throw an error if EmailValidator throws during validation', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new Error() as any })

    const input = { email: 'any_email@mail' }
    expect(() => sut.validate(input)).toThrow()
  })
})
