import { makeSignUpValidation } from './sign-up-validation'
import { ValidatorComposite } from '../../../presentation/helpers/validator-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/required-field-validation'

jest.mock('../../../presentation/helpers/validator-composite')

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
