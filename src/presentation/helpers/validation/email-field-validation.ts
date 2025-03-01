import { type Validation } from '../../protocols/validation'
import { InvalidParamError } from '../../errors'
import { type EmailValidator } from '../../protocols/email-validator'

export class EmailFieldValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: any): Error {
    const valid = this.emailValidator.isValid(input[this.fieldName] as string)

    if (!valid) {
      return new InvalidParamError(`${this.fieldName} is invalid`)
    }
  }
}
