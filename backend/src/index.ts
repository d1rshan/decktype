import { app } from './app/create-app'
import { env } from './config/env'
import { connectToDatabase } from './db/client'
import { ensureDatabaseIndexes } from './db/indexes'

await connectToDatabase()
await ensureDatabaseIndexes()

app.listen(env.port)

console.log(`Server running on ${env.betterAuthUrl}`)
