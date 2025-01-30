import { type IAddAccountRepository } from '../../../data/protocols/add-account-repository'
import { type AccountModel } from '../../../domain/models/account-model'
import { type AddAccountModel } from '../../../domain/use-cases/add-account'

export class AccountRepository implements IAddAccountRepository {
  async add (data: AddAccountModel): Promise<AccountModel> {
    return null
  }
}
