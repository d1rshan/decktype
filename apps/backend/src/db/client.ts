import { Db, MongoClient } from 'mongodb'

import { env } from '../config/env'

const globalMongo = globalThis as typeof globalThis & {
  __dkMongoClient?: MongoClient
  __dkMongoDb?: Db
  __dkMongoConnectPromise?: Promise<Db>
}

export const mongoClient =
  globalMongo.__dkMongoClient
  ?? new MongoClient(env.mongoUri, {
    connectTimeoutMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
    maxPoolSize: 20,
    minPoolSize: 1,
    retryWrites: true,
    family: 4,
  })

export const db = globalMongo.__dkMongoDb ?? mongoClient.db(env.mongoDbName)

if (!globalMongo.__dkMongoClient) {
  globalMongo.__dkMongoClient = mongoClient
}

if (!globalMongo.__dkMongoDb) {
  globalMongo.__dkMongoDb = db
}

export const connectToDatabase = async () => {
  if (globalMongo.__dkMongoConnectPromise) {
    return globalMongo.__dkMongoConnectPromise
  }

  globalMongo.__dkMongoConnectPromise = (async () => {
    console.log('Connecting to MongoDB...')

    try {
      await mongoClient.connect()
      await db.command({ ping: 1 })
      console.log('Successfully connected to MongoDB')
      return db
    } catch (error) {
      globalMongo.__dkMongoConnectPromise = undefined
      console.error('Failed to connect to MongoDB:', error)
      throw error
    }
  })()

  return globalMongo.__dkMongoConnectPromise
}
