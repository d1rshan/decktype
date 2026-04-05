import { Elysia } from 'elysia'

import { authRoutes } from '../features/auth/routes'
import { authPlugin } from '../features/auth/plugin'
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
  .use(resultRoutes)

export type App = typeof app
