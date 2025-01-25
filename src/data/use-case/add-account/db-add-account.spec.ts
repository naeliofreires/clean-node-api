import { type AddAccountModel } from '../../../domain/use-cases/add-account'
import { DbAddAccount } from './db-add-account'

const makeSut = (): any => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed') })
    }
  }
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('DB add account', () => {
  test('Should can Encrypter with correct password', async () => {
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
})
