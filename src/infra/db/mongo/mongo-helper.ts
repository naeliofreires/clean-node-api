import { MongoClient, type MongoClientOptions, type Collection } from 'mongodb'

const connectOptions: MongoClientOptions = {}

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string, options?: MongoClientOptions) {
    this.uri = uri
    this.client = await MongoClient.connect(uri, options ?? connectOptions)
  },

  async disconnect () {
    await this.client?.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (this.client === null) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  cleanCollection (name: string) {
    this.client.db().collection(name).deleteMany({})
  }
}
