import bcrypt from 'bcrypt'
import { BcrypterAdapter } from './BcryptAdapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  }
}))

const makeSut = (): {
  sut: BcrypterAdapter
} => {
  const sut = new BcrypterAdapter()

  return {
    sut
  }
}

describe('Bcrypter Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('your_value')
    expect(hashSpy).toHaveBeenCalledWith('your_value', 10)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const response = await sut.encrypt('your_value')
    expect(response).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const { sut } = makeSut()

    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(async () => { await Promise.reject(new Error()) }) // eslint-disable-line @typescript-eslint/no-misused-promises

    const returnedPromise = sut.encrypt('value')
    await expect(returnedPromise).rejects.toThrow()
  })
})
