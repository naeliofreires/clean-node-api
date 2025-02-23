import { type IController } from '../../protocols/controllers'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { type EmailValidator } from '../sign-up/sign-up-protocols'

export class SignInController implements IController {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'))
    }

    const email: string = httpRequest.body.email

    this.emailValidator.isValid(email)
  }
}
