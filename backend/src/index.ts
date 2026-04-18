import { app } from './app'
import { env } from './config/env'
import { connectToDatabase } from './db/client'
import { ensureDatabaseIndexes } from './db/indexes'

await connectToDatabase()
await ensureDatabaseIndexes()

app.listen(env.port)

console.log(`Server running on ${env.betterAuthUrl}`)

const gracefulShutdown = async () => {
  try {
    const { mongoClient } = await import('./db/client')
    await mongoClient.close()
  } finally {
    process.exit(0)
  }
}

process.on('SIGINT', () => {
  void gracefulShutdown()
})

process.on('SIGTERM', () => {
  void gracefulShutdown()
})
