import { type AccountModel } from '../../../domain/models/account-model'
import { type AddAccountModel } from '../../../domain/use-cases/add-account'
import { type IAddAccountRepository } from '../../protocols/add-account-repository'
import { type IEncrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

const makeEncrypterStub = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed') })
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add (data: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => {
        resolve({
          id: 1,
          ...data,
          password: 'hashed'
        })
      })
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): any => {
  const encrypterStub = makeEncrypterStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()

  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DB add account', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const data: AddAccountModel = {
      name: 'name',
      email: 'email@gmail.com',
      password: 'password'
    }

    await sut.add(data)
    expect(encryptSpy).toHaveBeenCalledWith(data.password)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const data: AddAccountModel = {
      name: 'name',
      email: 'email@gmail.com',
      password: 'password'
    }

    /**
     * The add method should return a rejected promise since we are not handling the error in the sut layer.
     * It is expected that error handling occurs at the presentation layer.
     */
    const returnedPromise = sut.add(data)
    await expect(returnedPromise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const data: AddAccountModel = {
      name: 'name',
      email: 'email@gmail.com',
      password: 'password'
    }

    await sut.add(data)
    expect(addSpy).toHaveBeenCalledWith({
      id: 1,
      name: 'name',
      email: 'email@gmail.com',
      password: 'hashed'
    })
  })
})
