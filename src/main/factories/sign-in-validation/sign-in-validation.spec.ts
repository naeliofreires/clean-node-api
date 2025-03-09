import { makeSignInValidation } from './sign-in-validation'
import { type Validation } from '../../../presentation/protocols/validation'
import { ValidatorComposite } from '../../../presentation/helpers/validation/validator-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-field-validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validation/email-field-validation'
import { EmailValidatorAdapter } from '../../../adapters/email-validator/email-validator-adapter'

jest.mock('../../../presentation/helpers/validation/validator-composite')

describe('SignInValidation Factory', () => {
  test('Should call ValidatorComposite with all validations', () => {
    makeSignInValidation()

    const validations: Validation[] = [
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new EmailFieldValidation(
        'email',
        new EmailValidatorAdapter())
    ]

    expect(ValidatorComposite).toHaveBeenCalledWith(validations)
  })
})
