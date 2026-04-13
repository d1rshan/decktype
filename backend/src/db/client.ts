import { Db, MongoClient } from 'mongodb'

import { env } from '../config/env'

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
  console.log('Connecting to MongoDB...')
  try {
    await mongoClient.connect()
    console.log('Successfully connected to MongoDB')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }

  return db
}
