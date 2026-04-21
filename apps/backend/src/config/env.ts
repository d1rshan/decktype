// TODO: use some library to do this stuff instead 
const readRequiredEnv = (name: string) => {
  const value = Bun.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const readOptionalEnv = (name: string) => {
  const value = Bun.env[name]

  if (!value) {
    return undefined
  }

  return value
}

const readNodeEnv = () => {
  const value = (Bun.env.NODE_ENV ?? 'development').trim().toLowerCase()

  if (value === 'production' || value === 'prod') {
    return 'production'
  }

  return 'development'
}

const readPort = () => {
  const rawPort = Bun.env.PORT ?? '3000'
  const port = Number(rawPort)

  if (Number.isNaN(port)) {
    throw new Error(`Invalid PORT value: ${rawPort}`)
  }

  return port
}

const readCsvEnv = (name: string) => {
  const value = Bun.env[name]

  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export const env = {
  nodeEnv: readNodeEnv(),
  port: readPort(),
  mongoUri: readRequiredEnv('MONGODB_URI'),
  mongoDbName: readRequiredEnv('MONGODB_DB_NAME'),
  betterAuthSecret: readRequiredEnv('BETTER_AUTH_SECRET'),
  betterAuthUrl: Bun.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  frontendOrigin: Bun.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  githubOwner: Bun.env.GITHUB_OWNER ?? 'd1rshan',
  githubRepo: Bun.env.GITHUB_REPO ?? 'decktype',
  githubToken: readOptionalEnv('GITHUB_TOKEN'),
  adminEmails: readCsvEnv('ADMIN_EMAILS'),
}
