import { ValidatorComposite } from '../../../presentation/helpers/validation/validator-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-field-validation'
import { CompareFieldValidation } from '../../../presentation/helpers/validation/compare-field-validation'

export const makeSignUpValidation = (): ValidatorComposite => {
  return new ValidatorComposite([
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('confirmPassword'),
    new CompareFieldValidation('password', 'confirmPassword')])
}
