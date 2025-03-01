import { DbAddAccount } from '../../data/use-case/add-account/db-add-account'
import { BcrypterAdapter } from '../../infra/criptography/BcryptAdapter'
import { SignUpController } from '../../presentation/controllers/sign-up/sign-up-controller'
import { type IController } from '../../presentation/protocols/controllers'
import { LogControllerDecorator } from '../decorators/log'
import { AccountRepository } from '../../infra/db/mongo/account-repository/account-repository'
import { LogRepository } from '../../infra/db/mongo/log-repository/log-repository'
import { makeSignUpValidation } from './sign-up-validation/sign-up-validation'

const makeDbAddAccount = (): DbAddAccount => {
  const encrypt = new BcrypterAdapter()
  const accountRepository = new AccountRepository()

  return new DbAddAccount(encrypt, accountRepository)
}

export const makeSignupController = (): IController => {
  const logErrorRepository = new LogRepository()

  const addAccount = makeDbAddAccount()
  const validationComposite = makeSignUpValidation()

  const signUpController = new SignUpController(addAccount, validationComposite)

  return new LogControllerDecorator(signUpController, logErrorRepository)
}
