import { app } from './app'
import { connectToDatabase } from './db'
import { env } from './env'
import { ensureResultsIndexes } from './results'

await connectToDatabase()
await ensureResultsIndexes()

app.listen(env.port)

console.log(`Server running on ${env.betterAuthUrl}`)
