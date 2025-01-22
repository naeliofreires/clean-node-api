import { InvalidParamError, MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { type Controller } from '../protocols/controllers'
import { type EmailValidator } from '../protocols/email-validator'

const requiredFields = ['name', 'email', 'password', 'confirmPassword']

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest

    for (const field of requiredFields) {
      if (!body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const isEmailValid = this.emailValidator.isValid(body.email as string)

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return {
      body: null,
      statusCode: 400
    }
  }
}
