import { type IController } from '../../protocols/controllers'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { badRequest, serverError } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { type EmailValidator } from '../sign-up/sign-up-protocols'
import { type Authentication } from '../../../domain/use-cases/authentication'

export class SignInController implements IController {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      if (!body?.email) {
        return badRequest(new MissingParamError('email'))
      }

      if (!body?.password) {
        return badRequest(new MissingParamError('password'))
      }

      const email: string = body.email

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.authentication.auth(body.email, body.password)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
