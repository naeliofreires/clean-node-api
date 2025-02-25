import { tryCatch, tryCatchAsync } from '../../helpers/error-helper'
import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type IController } from '../../protocols/controllers'
import { type AddAccountModel, type AddAccount } from '../../../domain/use-cases/add-account'
import { type Validation } from '../../protocols/validation'
import { type EmailValidator } from '../../protocols/email-validator'

export class SignUpController implements IController {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validationComposite: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validationComposite: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validationComposite = validationComposite
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    const hasError = this.validationComposite.validate(body)

    if (hasError) {
      return badRequest(hasError)
    }

    if (body.password !== body.confirmPassword) {
      return badRequest(new InvalidParamError('confirmPassword'))
    }

    const {
      data: isEmailValid,
      error: emailValidatorError
    } = tryCatch(() => this.emailValidator.isValid(body.email as string))

    if (emailValidatorError) {
      return serverError(emailValidatorError)
    }

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }

    const { name, email, password } = body
    const { data, error: addAccountError } = await tryCatchAsync(this.addAccount.add({ name, email, password } satisfies AddAccountModel))

    if (addAccountError) {
      return serverError(addAccountError)
    }

    return ok(data)
  }
}
