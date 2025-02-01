import { MongoClient, type MongoClientOptions, type Collection } from 'mongodb'

const connectOptions: MongoClientOptions = {}

export const MonogHelper = {
  client: null as MongoClient,
  async connect (uri: string, options?: MongoClientOptions) {
    console.log({uri})
    this.client = await MongoClient.connect(uri, options ?? connectOptions)
  },

  async disconnect () {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  cleanCollection (name: string) {
    this.client.db().collection(name).deleteMany({})
  }
}
