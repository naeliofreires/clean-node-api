import { tryCatch, tryCatchAsync } from '../../helpers/error-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type IController } from '../../protocols/controllers'
import { type EmailValidator } from './sign-up-protocols'
import { type AddAccountModel, type AddAccount } from '../../../domain/use-cases/add-account'

const requiredFields = ['name', 'email', 'password', 'confirmPassword']

export class SignUpController implements IController {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    for (const field of requiredFields) {
      if (!body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    if (body.password !== body.confirmPassword) {
      return badRequest(new InvalidParamError('confirmPassword'))
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

    const { name, email, password } = body
    const { data, error: addAccountError } = await tryCatchAsync(this.addAccount.add({ name, email, password } satisfies AddAccountModel))

    if (addAccountError) {
      return serverError()
    }

    return ok(data)
  }
}
