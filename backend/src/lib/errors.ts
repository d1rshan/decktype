export const errorCodes = {
  badRequest: 'BAD_REQUEST',
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  notFound: 'NOT_FOUND',
  conflict: 'CONFLICT',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  validation: 'VALIDATION_ERROR',
} as const

export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes]

const CodeToStatus: Record<ErrorCode, number> = {
  [errorCodes.badRequest]: 400,
  [errorCodes.unauthorized]: 401,
  [errorCodes.forbidden]: 403,
  [errorCodes.notFound]: 404,
  [errorCodes.conflict]: 409,
  [errorCodes.internalServerError]: 500,
  [errorCodes.validation]: 400,
}

export class ApiError extends Error {
  readonly status: number
  readonly code: ErrorCode

  constructor(code: ErrorCode, message: string, status?: number) {
    super(message)

    this.name = 'ApiError'
    this.code = code
    this.status = status ?? CodeToStatus[code] ?? 500
  }

  static badRequest(message: string) {
    return new ApiError(errorCodes.badRequest, message)
  }

  static unauthorized(message: string) {
    return new ApiError(errorCodes.unauthorized, message)
  }

  static forbidden(message: string) {
    return new ApiError(errorCodes.forbidden, message)
  }

  static notFound(message: string) {
    return new ApiError(errorCodes.notFound, message)
  }

  static conflict(message: string) {
    return new ApiError(errorCodes.conflict, message)
  }

  static internal(message = 'Something went wrong.') {
    return new ApiError(errorCodes.internalServerError, message)
  }
}

type ErrorResponse = {
  code: string
  message: string
}

export const toErrorResponse = (
  error: unknown,
  elysiaCode?: string | number,
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

  // Handle Elysia built-in errors
  if (elysiaCode === 'VALIDATION') {
    return {
      status: 400,
      body: {
        code: errorCodes.validation,
        message: (error as any)?.message || 'Request validation failed.',
      },
    }
  }

  if (elysiaCode === 'NOT_FOUND') {
    return {
      status: 404,
      body: {
        code: errorCodes.notFound,
        message: 'Resource not found.',
      },
    }
  }

  // Log unexpected errors
  console.error('[Unhandled Error]:', error)

  return {
    status: 500,
    body: {
      code: errorCodes.internalServerError,
      message: 'Internal server error.',
    },
  }
}
