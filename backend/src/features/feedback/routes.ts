import { Elysia } from 'elysia'

import { createFeedbackBodySchema } from './schema'
import { submitFeedback, listFeedback, upvoteFeedback, downvoteFeedback } from './service'
import { requireSession } from '../auth/session'
import { ApiError } from '../../lib/errors/api-error'
import { errorCodes } from '../../lib/errors/error-codes'

export const feedbackRoutes = new Elysia({ prefix: '/api/feedback' })
  .get('/', async () => {
    return listFeedback()
  })
  .post(
    '/',
    async ({ body, request: { headers }, set }) => {
      const { user } = await requireSession(headers)

      const displayName = user.name?.trim() || user.email || user.id

      const feedback = await submitFeedback({
        content: body.content,
        userId: user.id,
        userDisplayName: displayName,
      })

      set.status = 201

      return feedback
    },
    {
      body: createFeedbackBodySchema,
    },
  )
  .post('/:id/upvote', async ({ params: { id }, request: { headers } }) => {
    const { user } = await requireSession(headers)
    const result = await upvoteFeedback({ feedbackId: id, userId: user.id })

    if (!result) {
      throw new ApiError({
        status: 404,
        code: errorCodes.notFound,
        message: 'Feedback not found.',
      })
    }

    return result
  })
  .post('/:id/downvote', async ({ params: { id }, request: { headers } }) => {
    const { user } = await requireSession(headers)
    const result = await downvoteFeedback({ feedbackId: id, userId: user.id })

    if (!result) {
      throw new ApiError({
        status: 404,
        code: errorCodes.notFound,
        message: 'Feedback not found.',
      })
    }

    return result
  })
