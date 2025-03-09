import { type Validation } from '../../protocols/validation'
import { ValidatorComposite } from './validator-composite'

const makeValidationMock = (): Validation => {
  return {
    validate: jest.fn()
  }
}

describe('ValidatorComposite', () => {
  test('should return null if all validations pass', () => {
    const validation1 = makeValidationMock()
    const validation2 = makeValidationMock()

    jest.spyOn(validation1, 'validate').mockReturnValue(null)
    jest.spyOn(validation2, 'validate').mockReturnValue(null)

    const sut = new ValidatorComposite([validation1, validation2])
    const result = sut.validate({})
    expect(result).toBeNull()
    expect(validation1.validate).toHaveBeenCalledWith({})
    expect(validation2.validate).toHaveBeenCalledWith({})
    expect(validation1.validate).toHaveBeenCalledTimes(1)
    expect(validation2.validate).toHaveBeenCalledTimes(1)
  })

  test('should return the first error if one of the validations fails', () => {
    const validation1 = makeValidationMock()
    const validation2 = makeValidationMock()
    jest.spyOn(validation1, 'validate').mockReturnValue(new Error('error1'))
    jest.spyOn(validation2, 'validate').mockReturnValue(null)
    const sut = new ValidatorComposite([validation1, validation2])

    const result = sut.validate({})

    expect(result).toEqual(new Error('error1'))
    expect(validation1.validate).toHaveBeenCalledWith({})
    expect(validation2.validate).not.toHaveBeenCalled()
  })

  test('should return null if no validations are provided', () => {
    const sut = new ValidatorComposite([])
    const result = sut.validate({})
    expect(result).toBeNull()
  })
})
