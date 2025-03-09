import { type IController } from '../../protocols/controllers'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { type Authentication } from '../../../domain/use-cases/authentication'
import { type Validation } from '../../protocols/validation'

export class SignInController implements IController {
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      const error = this.validation.validate(body)

      if (error) { return badRequest(error) }

      const token = await this.authentication.auth(body.email as string, body.password as string)

      if (!token) { return unauthorized() }

      return ok({ accessToken: token })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
