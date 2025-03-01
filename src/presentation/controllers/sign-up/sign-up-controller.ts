import { tryCatchAsync } from '../../helpers/error-helper'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type IController } from '../../protocols/controllers'
import { type AddAccountModel, type AddAccount } from '../../../domain/use-cases/add-account'
import { type Validation } from '../../protocols/validation'

export class SignUpController implements IController {
  private readonly addAccount: AddAccount
  private readonly validationComposite: Validation

  constructor (addAccount: AddAccount, validationComposite: Validation) {
    this.addAccount = addAccount
    this.validationComposite = validationComposite
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    const hasError = this.validationComposite.validate(body)

    if (hasError) {
      return badRequest(hasError)
    }

    const { name, email, password } = body
    const { data, error: addAccountError } = await tryCatchAsync(this.addAccount.add({ name, email, password } satisfies AddAccountModel))

    if (addAccountError) {
      return serverError(addAccountError)
    }

    return ok(data)
  }
}
