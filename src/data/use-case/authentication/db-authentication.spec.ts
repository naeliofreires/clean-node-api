import { AccountModel } from '../../../domain/models/account-model'
import { AuthenticationParams } from '../../../domain/use-cases/authentication'
import { HashComparer } from '../../protocols/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { TokenGenerator } from '../../protocols/token-generator'
import { DbAuthentication } from './db-authentication'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load(email: string): Promise<AccountModel> {
    const account: AccountModel = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    }
    return account
  }
}

class HashComparerStub implements HashComparer {
  async compare(value: string, hash: string): Promise<boolean> {
    return Promise.resolve(true)
  }
}

class TokenGeneratorStub implements TokenGenerator {
  async generate(value: string): Promise<string> {
    return Promise.resolve('any_token')
  }
}

const makeAuthenticationParams = (): AuthenticationParams => ({
  email: 'email@gmail.com',
  password: '<PASSWORD>',
})

type SutTypes = {
  sut: DbAuthentication
  hashComparerStub: HashComparerStub
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
  tokenGeneratorStub: TokenGeneratorStub
}

const makeSut = (): SutTypes => {
  const hashComparerStub = new HashComparerStub()
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const tokenGeneratorStub = new TokenGeneratorStub()

  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub)

  return {
    sut,
    hashComparerStub,
    loadAccountByEmailRepositoryStub,
    tokenGeneratorStub,
  }
}

describe('DbAuthentication', () => {
  test('Should call DbAuthentication.auth with correct params', async () => {
    const { sut } = makeSut()
    const auhSpy = jest.spyOn(sut, 'auth')

    await sut.auth(makeAuthenticationParams())
    expect(auhSpy).toHaveBeenCalledWith(makeAuthenticationParams())
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.auth(makeAuthenticationParams())
    expect(loadSpy).toHaveBeenCalledWith('email@gmail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((_, reject) => {
        reject(new Error())
      })
    )

    const promise = sut.auth(makeAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)

    const authResponse = await sut.auth(makeAuthenticationParams())
    expect(authResponse).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const hashSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(makeAuthenticationParams())
    expect(hashSpy).toHaveBeenCalledWith(makeAuthenticationParams().password, 'any_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((_, reject) => {
        reject(new Error())
      })
    )

    const promise = sut.auth(makeAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(false)
      })
    )

    const authResponse = await sut.auth(makeAuthenticationParams())
    expect(authResponse).toBeNull()
  })

  test('Should call TokenGenerator with correct values', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const tokenSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    const generatedToken = await sut.auth(makeAuthenticationParams())

    expect(tokenSpy).toHaveBeenCalledWith('any_id')
    expect(generatedToken).toBe('any_token')
  })
})
