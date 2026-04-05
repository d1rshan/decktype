const readRequiredEnv = (name: string) => {
  const value = Bun.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const readPort = () => {
  const rawPort = Bun.env.PORT ?? '3000'
  const port = Number(rawPort)

  if (Number.isNaN(port)) {
    throw new Error(`Invalid PORT value: ${rawPort}`)
  }

  return port
}

export const env = {
  port: readPort(),
  mongoUri: readRequiredEnv('MONGODB_URI'),
  mongoDbName: readRequiredEnv('MONGODB_DB_NAME'),
  betterAuthSecret: readRequiredEnv('BETTER_AUTH_SECRET'),
  betterAuthUrl: Bun.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  frontendOrigin: Bun.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
}
