import { makeSignUpValidation } from './sign-up-validation'
import { ValidatorComposite } from '../../../presentation/helpers/validation/validator-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-field-validation'
import { CompareFieldValidation } from '../../../presentation/helpers/validation/compare-field-validation'
import { type Validation } from '../../../presentation/protocols/validation'

jest.mock('../../../presentation/helpers/validation/validator-composite')

describe('SignUpValidation Factory', () => {
  test('Should  call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = [
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('confirmPassword'),
      new CompareFieldValidation('password', 'confirmPassword')
    ]

    expect(ValidatorComposite).toHaveBeenCalledWith(validations)
  })
})
