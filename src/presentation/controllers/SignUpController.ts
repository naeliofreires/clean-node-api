import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { type Controller } from '../protocols/controllers'
import { type EmailValidator } from '../protocols/email-validator'
import { tryCatch } from '../helpers/error-helper'

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

    const {
      data: isEmailValid,
      error: emailValidatorError
    } = tryCatch(() => this.emailValidator.isValid(body.email as string))

    if (emailValidatorError) {
      return serverError()
    }

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return {
      body: null,
      statusCode: 400
    }
  }
}
