import { type AccountModel } from '../../domain/models/account-model'
import { type AddAccountModel } from '../../domain/use-cases/add-account'

export interface IAddAccountRepository {
  add: (data: AddAccountModel) => Promise<AccountModel>
}
