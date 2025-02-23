import { EmailValidatorAdapter } from '../../adapters/email-validator/email-validator-adapter'
import { DbAddAccount } from '../../data/use-case/add-account/db-add-account'
import { BcrypterAdapter } from '../../infra/criptography/BcryptAdapter'
import { SignUpController } from '../../presentation/controllers/sign-up/sign-up-controller'
import { type IController } from '../../presentation/protocols/controllers'
import { LogControllerDecorator } from '../decorators/log'
import { AccountRepository } from '../../infra/db/mongo/account-repository/account-repository'
import { LogRepository } from '../../infra/db/mongo/log-repository/log-repository'

const makeDbAddAccount = (): DbAddAccount => {
  const encrypt = new BcrypterAdapter()
  const accountRepository = new AccountRepository()

  return new DbAddAccount(encrypt, accountRepository)
}

export const makeSignupController = (): IController => {
  const logErrorRepository = new LogRepository()
  const emailValidatorAdapter = new EmailValidatorAdapter()

  const addAccount = makeDbAddAccount()

  const signUpController = new SignUpController(emailValidatorAdapter, addAccount)

  return new LogControllerDecorator(signUpController, logErrorRepository)
}
