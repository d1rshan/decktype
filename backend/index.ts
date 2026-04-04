import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'

import { auth } from './auth'
import { connectToDatabase } from './db'
import { env } from './env'

await connectToDatabase()

const betterAuth = new Elysia({ name: 'better-auth' })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const currentSession = await auth.api.getSession({
          headers,
        })

        if (!currentSession) {
          return status(401, {
            error: 'Unauthorized',
          })
        }

        return {
          user: currentSession.user,
          session: currentSession.session,
        }
      },
    },
  })

const app = new Elysia()
  .use(
    cors({
      origin: env.frontendOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  .use(betterAuth)
  .get('/', () => ({
    ok: true,
    service: 'backend',
  }))
  .get('/api/health', () => ({
    ok: true,
  }))
  .get(
    '/api/me',
    ({ user, session }) => ({
      user,
      session,
    }),
    {
      auth: true,
    },
  )
  .listen(env.port)

console.log(`Server running on ${env.betterAuthUrl}`)
