import { ValidatorComposite } from '../../../presentation/helpers/validator-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/required-field-validation'

export const makeSignUpValidation = (): ValidatorComposite => {
  return new ValidatorComposite([
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('confirmPassword')])
}
