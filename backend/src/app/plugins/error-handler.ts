import { Elysia } from 'elysia'

import { toErrorResponse } from '../../lib/errors'

export const errorHandlerPlugin = new Elysia({ name: 'error-handler' }).onError(
  ({ code, error, set }) => {
    const response = toErrorResponse(error, code)

    set.status = response.status

    return response.body
  },
)
