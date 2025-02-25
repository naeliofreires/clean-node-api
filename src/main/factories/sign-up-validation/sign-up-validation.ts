import { ValidatorComposite } from '../../../presentation/helpers/validation/validator-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-field-validation'

export const makeSignUpValidation = (): ValidatorComposite => {
  return new ValidatorComposite([
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('confirmPassword')])
}
