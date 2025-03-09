import { ValidatorComposite } from '../../../presentation/helpers/validation/validator-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-field-validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validation/email-field-validation'
import { EmailValidatorAdapter } from '../../../adapters/email-validator/email-validator-adapter'

export const makeSignInValidation = (): ValidatorComposite => {
  return new ValidatorComposite([
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new EmailFieldValidation(
      'email',
      new EmailValidatorAdapter())
  ])
}
