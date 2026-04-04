import { Db, MongoClient } from 'mongodb'

import { env } from './env'

const globalMongo = globalThis as typeof globalThis & {
  __dkMongoClient?: MongoClient
  __dkMongoDb?: Db
}

export const mongoClient =
  globalMongo.__dkMongoClient ?? new MongoClient(env.mongoUri)

export const db = globalMongo.__dkMongoDb ?? mongoClient.db(env.mongoDbName)

if (!globalMongo.__dkMongoClient) {
  globalMongo.__dkMongoClient = mongoClient
}

if (!globalMongo.__dkMongoDb) {
  globalMongo.__dkMongoDb = db
}

export const connectToDatabase = async () => {
  await mongoClient.connect()

  return db
}
