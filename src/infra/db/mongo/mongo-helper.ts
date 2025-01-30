import { MongoClient, type MongoClientOptions } from 'mongodb'

const connectOptions: MongoClientOptions = {
  // @ts-expect-error
  useNewUrlParser: true,
  useUnifiedTopology: true
}

export const MonogHelper = {
  client: null as MongoClient,
  async connect (uri: string, options?: MongoClientOptions) {
    this.client = await MongoClient.connect(uri, options ?? connectOptions)
  },
  async disconnect () {
    await this.client.close()
  }
}
