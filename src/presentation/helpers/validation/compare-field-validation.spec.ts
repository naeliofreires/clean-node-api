import { CompareFieldValidation } from './compare-field-validation'
import { InvalidParamError } from '../../errors'

describe('CompareFieldValidation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = new CompareFieldValidation('field', 'field2')
    const error = sut.validate({ field: 'value' } as any)
    expect(error).toEqual(new InvalidParamError('field must be equal to field2'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = new CompareFieldValidation('field', 'field2')
    const error = sut.validate({ field: 'any_value', field2: 'any_value' } as any)
    expect(error).toBeFalsy()
  })
})
