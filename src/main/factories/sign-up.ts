import { EmailValidatorAdapter } from '../../adapters/email-validator/email-validator-adapter'
import { DbAddAccount } from '../../data/use-case/add-account/db-add-account'
import { BcrypterAdapter } from '../../infra/criptography/BcryptAdapter'
import { AccountRepository } from '../../infra/db/mongo/account-repository'
import { SignUpController } from '../../presentation/controllers/sign-up/sign-up-controller'

const makeEmailValidatorAdapter = (): EmailValidatorAdapter => new EmailValidatorAdapter()

const makeBcrypterAdapter = (): BcrypterAdapter => new BcrypterAdapter()

export const makeAccountRepository = (): AccountRepository => new AccountRepository()

export const makeDbAddAccount = (): DbAddAccount => {
  const encrypter = makeBcrypterAdapter()
  const accountRepository = makeAccountRepository()

  return new DbAddAccount(encrypter, accountRepository)
}

export const makeSignupController = (): SignUpController => {
  const emailValidatorAdapter = makeEmailValidatorAdapter()
  const addAccount = makeDbAddAccount()

  return new SignUpController(emailValidatorAdapter, addAccount)
}
