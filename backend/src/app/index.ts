import { Elysia } from 'elysia'

import { adminRoutes } from '../features/admin/routes'
import { authRoutes } from '../features/auth/routes'
import { authPlugin } from '../features/auth/plugin'
import { feedbackRoutes } from '../features/feedback/routes'
import { leaderboardRoutes } from '../features/leaderboard/routes'
import { resultRoutes } from '../features/results/routes'

import { corsPlugin } from './plugins/cors'
import { errorHandlerPlugin } from './plugins/error-handler'

export const app = new Elysia()
  .use(errorHandlerPlugin)
  .use(corsPlugin)
  .use(authPlugin)
  .get('/', () => ({
    ok: true,
    service: 'backend',
  }))
  .get('/api/health', () => ({
    ok: true,
  }))
  .use(authRoutes)
  .use(adminRoutes)
  .use(leaderboardRoutes)
  .use(resultRoutes)
  .use(feedbackRoutes)

export type App = typeof app
