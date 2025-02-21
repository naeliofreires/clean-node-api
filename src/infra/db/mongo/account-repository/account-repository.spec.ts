import { type IAddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountRepository } from './account-repository'
import { MongoHelper } from '../mongo-helper'

const makeSut = (): { sut: IAddAccountRepository } => {
  const sut = new AccountRepository()
  return {
    sut
  }
}

describe('Mongo: account repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    MongoHelper.cleanCollection('accounts')
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const added = await sut.add({
      name: 'valid_name',
      password: 'valid_password',
      email: 'valid@email.com'
    })

    expect(added).toBeTruthy()
    expect(added.id).toBeTruthy()
    expect(added.name).toBe('valid_name')
    expect(added.email).toBe('valid@email.com')
    expect(added.password).toBe('valid_password')
  })
})
