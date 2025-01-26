import { type AddAccountModel, type AddAccount } from '../../../domain/use-cases/add-account'
import { type IAddAccountRepository } from '../../protocols/add-account-repository'
import { type IEncrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: IEncrypter
  private readonly addAccountRepository: IAddAccountRepository

  constructor (encrypter: IEncrypter, addAccountRepository: IAddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (data: AddAccountModel): Promise<any> {
    const hashedPassword = await this.encrypter.encrypt(data.password)

    const newAccount = { id: 1, ...data, password: hashedPassword }

    await this.addAccountRepository.add(newAccount)

    return await new Promise(resolve => { resolve(null) })
  }
}
