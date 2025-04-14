import { AccountModel } from '../../../domain/models/account-model'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load(email: string): Promise<AccountModel> {
    const account: AccountModel = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    }
    return Promise.resolve(account)
  }
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
  }
}

describe('DbAuthentication', () => {
  test('Should call DbAuthentication.auth with correct params', async () => {
    const { sut } = makeSut()
    const auhSpy = jest.spyOn(sut, 'auth')

    await sut.auth({
      email: 'email@gmail.com',
      password: '<PASSWORD>',
    })

    expect(auhSpy).toHaveBeenCalledWith({
      email: 'email@gmail.com',
      password: '<PASSWORD>',
    })
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.auth({
      email: 'email@gmail.com',
      password: '<PASSWORD>',
    })

    expect(loadSpy).toHaveBeenCalledWith('email@gmail.com')
  })
})
