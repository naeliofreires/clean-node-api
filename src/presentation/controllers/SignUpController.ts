import { MissingParamError } from '../errors/missing-param-error'
import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest

    if (!body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }

    if (!body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }

    return {
      body: null,
      statusCode: 400
    }
  }
}
