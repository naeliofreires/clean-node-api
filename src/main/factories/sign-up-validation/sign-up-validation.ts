import { ValidatorComposite } from '../../../presentation/helpers/validation/validator-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-field-validation'
import { CompareFieldValidation } from '../../../presentation/helpers/validation/compare-field-validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validation/email-field-validation'
import { EmailValidatorAdapter } from '../../../adapters/email-validator/email-validator-adapter'

export const makeSignUpValidation = (): ValidatorComposite => {
  return new ValidatorComposite([
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('confirmPassword'),
    new CompareFieldValidation('password', 'confirmPassword'),
    new EmailFieldValidation('email', new EmailValidatorAdapter())]
  )
}
