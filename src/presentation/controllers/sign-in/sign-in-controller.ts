import { type IController } from '../../protocols/controllers'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { badRequest, serverError } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { type EmailValidator } from '../sign-up/sign-up-protocols'

export class SignInController implements IController {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
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
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
