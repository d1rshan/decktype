import { ApiError } from '../../lib/errors/api-error'
import { errorCodes } from '../../lib/errors/error-codes'
import { auth } from './auth'

export const requireSession = async (headers: Headers) => {
  const currentSession = await auth.api.getSession({
    headers,
  })

  if (!currentSession) {
    throw new ApiError({
      status: 401,
      code: errorCodes.unauthorized,
      message: 'You must be signed in.',
    })
  }

  return currentSession
}
