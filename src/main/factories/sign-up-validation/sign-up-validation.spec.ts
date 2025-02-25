import { makeSignUpValidation } from './sign-up-validation'
import { ValidatorComposite } from '../../../presentation/helpers/validation/validator-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-field-validation'

jest.mock('../../../presentation/helpers/validation/validator-composite')

describe('SignUpValidation Factory', () => {
  test('Should  call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    expect(ValidatorComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('confirmPassword')
    ])
  })
})
