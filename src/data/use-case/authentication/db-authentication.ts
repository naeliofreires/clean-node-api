import { Authentication, AuthenticationParams } from '../../../domain/use-cases/authentication'
import { HashComparer } from '../../protocols/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { TokenGenerator } from '../../protocols/token-generator'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth(params: AuthenticationParams) {
    const account = await this.loadAccountByEmailRepository.load(params.email)

    if (!account) return null

    const isValid = await this.hashComparer.compare(params.password, account.password)

    if (!isValid) return null

    const token = await this.tokenGenerator.generate(account.id.toString())

    return token
  }
}
