import { type AddAccountModel, type AddAccount } from '../../../domain/use-cases/add-account'
import { type IEncrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: IEncrypter

  constructor (encrypter: IEncrypter) {
    this.encrypter = encrypter
  }

  async add (data: AddAccountModel): Promise<any> {
    await this.encrypter.encrypt(data.password)
    return await new Promise(resolve => { resolve(null) })
  }
}
