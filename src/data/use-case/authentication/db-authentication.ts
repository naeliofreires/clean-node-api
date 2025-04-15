import { Authentication, AuthenticationParams } from '../../../domain/use-cases/authentication'
import { HashComparer } from '../../protocols/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth(params: AuthenticationParams) {
    const account = await this.loadAccountByEmailRepository.load(params.email)

    if (!account) return null

    await this.hashComparer.compare(params.password, account.password)

    return null
  }
}
