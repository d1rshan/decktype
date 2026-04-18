import { Elysia, t } from 'elysia'

import { requireAdminSession } from '../auth/session'
import { removeFeedback } from '../feedback/service'

import {
  adminUserResponseSchema,
  deleteFeedbackParamsSchema,
  deleteFeedbackResponseSchema,
  usersCountResponseSchema,
} from './schema'
import { getUsersCount, getUsersList } from './service'

export const adminRoutes = new Elysia({ prefix: '/api/admin' })
  .get(
    '/users/count',
    async ({ request: { headers } }) => {
      await requireAdminSession(headers)

      return getUsersCount()
    },
    {
      response: usersCountResponseSchema,
    },
  )
  .get(
    '/users', // TODO: proper pagination
    async ({ request: { headers } }) => {
      await requireAdminSession(headers)

      return getUsersList()
    },
    {
      response: t.Array(adminUserResponseSchema),
    },
  )
  .delete(
    '/feedback/:id',
    async ({ params, request: { headers } }) => {
      await requireAdminSession(headers)

      return removeFeedback(params.id)
    },
    {
      params: deleteFeedbackParamsSchema,
      response: deleteFeedbackResponseSchema,
    },
  )
