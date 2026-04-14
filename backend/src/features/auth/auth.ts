import { mongodbAdapter } from '@better-auth/mongo-adapter'
import { betterAuth } from 'better-auth'

import { env } from '../../config/env'
import { db, mongoClient } from '../../db/client'

const isProduction = env.nodeEnv === 'production'

export const auth = betterAuth({
  secret: env.betterAuthSecret,
  baseURL: env.betterAuthUrl,
  trustedOrigins: [env.frontendOrigin],
  advanced: {
    useSecureCookies: isProduction,
    defaultCookieAttributes: {
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      httpOnly: true,
    },
  },
  database: mongodbAdapter(db, {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
  },
})
