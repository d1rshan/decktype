import { Elysia } from 'elysia'

import { requireSession } from './session'

export const authRoutes = new Elysia({ prefix: '/api' }).get(
  '/me',
  async ({ request: { headers } }) => {
    const { user, session } = await requireSession(headers)

    return {
      user,
      session,
    }
  },
)
