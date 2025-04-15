import { Authentication, AuthenticationParams } from '../../../domain/use-cases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth(params: AuthenticationParams) {
    await this.loadAccountByEmailRepository.load(params.email)
    return null
  }
}
