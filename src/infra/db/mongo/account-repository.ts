import { type IAddAccountRepository } from '../../../data/protocols/add-account-repository'
import { type AccountModel } from '../../../domain/models/account-model'
import { type AddAccountModel } from '../../../domain/use-cases/add-account'
import { MongoHelper } from './mongo-helper'

export class AccountRepository implements IAddAccountRepository {
  async add (data: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const insertedDocument = await accountCollection.insertOne(data)
    const account = await accountCollection.findOne({ _id: insertedDocument.insertedId })

    const { _id, ...rest } = account
    return { ...rest as unknown as AccountModel, id: String(_id) }
  }
}
