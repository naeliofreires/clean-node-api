import { type ILogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoHelper } from '../mongo-helper'

export class LogRepository implements ILogErrorRepository {
  async logError (stack: string): Promise<void> {
    const collection = await MongoHelper.getCollection('errors')
    await collection.insertOne({
      stack,
      createdAt: new Date().toISOString()
    })
  }
}
