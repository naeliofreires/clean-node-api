import { MongoHelper } from '../mongo-helper'
import { LogRepository } from './log-repository'
import { type ILogErrorRepository } from '../../../../data/protocols/log-error-repository'

const makeSut = (): { sut: ILogErrorRepository } => {
  const sut = new LogRepository()
  return {
    sut
  }
}

describe('MongoDB: log repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    MongoHelper.cleanCollection('errors')
  })

  test('Should create an error log on success', async () => {
    const { sut } = makeSut()

    await sut.logError('error')
    const collection = await MongoHelper.getCollection('errors')
    const count = await collection.countDocuments()
    expect(count).toBe(1)
  })
})
