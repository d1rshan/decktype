import { cors } from '@elysiajs/cors'
import { Elysia, t } from 'elysia'

import { auth } from './auth'
import { env } from './env'
import { resultsCollection } from './results'
import { serializeGameResult } from './results'

export const betterAuth = new Elysia({ name: 'better-auth' })
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

export const app = new Elysia()
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
  .post(
    '/api/results',
    async ({ body, user, set }) => {
      const result = {
        userId: user.id,
        gameId: body.gameId,
        score: body.score,
        difficulty: body.difficulty,
        createdAt: new Date(),
      }

      const insertedResult = await resultsCollection.insertOne(result)

      set.status = 201

      return serializeGameResult({
        _id: insertedResult.insertedId,
        ...result,
      })
    },
    {
      auth: true,
      body: t.Object({
        gameId: t.String({ minLength: 1 }),
        score: t.Number(),
        difficulty: t.String({ minLength: 1 }),
      }),
    },
  )
  .get(
    '/api/results/me',
    async ({ user, query }) => {
      const results = await resultsCollection
        .find(
          {
            userId: user.id,
            ...(query.gameId ? { gameId: query.gameId } : {}),
          },
          {
            sort: { createdAt: -1 },
            limit: query.limit,
          },
        )
        .toArray()

      return results.map(serializeGameResult)
    },
    {
      auth: true,
      query: t.Object({
        gameId: t.Optional(t.String({ minLength: 1 })),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
      }),
    },
  )

export type App = typeof app
