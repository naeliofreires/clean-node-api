import { makeSignUpValidation } from './sign-up-validation'
import { ValidatorComposite } from '../../../presentation/helpers/validation/validator-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-field-validation'
import { CompareFieldValidation } from '../../../presentation/helpers/validation/compare-field-validation'
import { type Validation } from '../../../presentation/protocols/validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validation/email-field-validation'
import { EmailValidatorAdapter } from '../../../adapters/email-validator/email-validator-adapter'

/**
 * With the use of `jest.mock`, the real behavior of the `validator-composite`
 * module is replaced by a mock controlled by Jest. The Jest will "spy"
 * on or "intercept" all uses of `ValidatorComposite` in the code during
 * the test, such as function calls, received arguments, etc.
 */

jest.mock('../../../presentation/helpers/validation/validator-composite')

describe('SignUpValidation Factory', () => {
  test('Should  call ValidationComposite with all validations', () => {
    makeSignUpValidation()

    const validations: Validation[] = [
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('confirmPassword'),
      new CompareFieldValidation('password', 'confirmPassword'),
      new EmailFieldValidation('email', new EmailValidatorAdapter())
    ]

    expect(ValidatorComposite).toHaveBeenCalledWith(validations)
  })
})
