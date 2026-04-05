import { ApiError } from './api-error'
import { errorCodes } from './error-codes'

type ErrorResponse = {
  code: string
  message: string
}

export const toErrorResponse = (
  error: unknown,
  errorType?: string | number,
): { status: number; body: ErrorResponse } => {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      body: {
        code: error.code,
        message: error.message,
      },
    }
  }

  if (errorType === 'VALIDATION') {
    return {
      status: 400,
      body: {
        code: errorCodes.badRequest,
        message: 'Request validation failed.',
      },
    }
  }

  return {
    status: 500,
    body: {
      code: errorCodes.internalServerError,
      message: 'Something went wrong.',
    },
  }
}
