import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { type Controller } from '../protocols/controllers'

const requiredFields = ['name', 'email', 'password', 'confirmPassword']

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest

    for (const field of requiredFields) {
      if (!body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return {
      body: null,
      statusCode: 400
    }
  }
}
