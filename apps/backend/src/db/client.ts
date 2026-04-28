import { Db, MongoClient } from "mongodb";

import { env } from "../config/env";

const globalMongo = globalThis as typeof globalThis & {
  __dkMongoClient?: MongoClient;
  __dkMongoDb?: Db;
  __dkMongoConnectPromise?: Promise<Db>;
};

export const mongoClient =
  globalMongo.__dkMongoClient ??
  new MongoClient(env.mongoUri, {
    appName: "decktype-backend",
    connectTimeoutMS: 5_000,
    serverSelectionTimeoutMS: 5_000,
    socketTimeoutMS: 45_000,
    maxPoolSize: 5,
    maxIdleTimeMS: 60_000,
    retryWrites: true,
  });

export const db = globalMongo.__dkMongoDb ?? mongoClient.db(env.mongoDbName);

if (!globalMongo.__dkMongoClient) {
  globalMongo.__dkMongoClient = mongoClient;
}

if (!globalMongo.__dkMongoDb) {
  globalMongo.__dkMongoDb = db;
}

export const connectToDatabase = async () => {
  if (globalMongo.__dkMongoConnectPromise) {
    return globalMongo.__dkMongoConnectPromise;
  }

  globalMongo.__dkMongoConnectPromise = mongoClient
    .connect()
    .then(() => db.command({ ping: 1 }))
    .then(() => db)
    .catch((error) => {
      globalMongo.__dkMongoConnectPromise = undefined;
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    });

  return globalMongo.__dkMongoConnectPromise;
};
