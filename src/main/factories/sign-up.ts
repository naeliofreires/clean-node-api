import { EmailValidatorAdapter } from '../../adapters/email-validator/email-validator-adapter'
import { DbAddAccount } from '../../data/use-case/add-account/db-add-account'
import { BcrypterAdapter } from '../../infra/criptography/BcryptAdapter'
import { AccountRepository } from '../../infra/db/mongo/account-repository'
import { SignUpController } from '../../presentation/controllers/sign-up/sign-up-controller'
import { type IController } from '../../presentation/protocols/controllers'
import { LogControllerDecorator } from '../decorators/log'

const makeDbAddAccount = (): DbAddAccount => {
  const encrypter = new BcrypterAdapter()
  const accountRepository = new AccountRepository()

  return new DbAddAccount(encrypter, accountRepository)
}

export const makeSignupController = (): IController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const addAccount = makeDbAddAccount()

  const signUpController = new SignUpController(emailValidatorAdapter, addAccount)

  return new LogControllerDecorator(signUpController)
}
