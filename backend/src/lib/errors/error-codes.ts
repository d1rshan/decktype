export const errorCodes = {
  badRequest: 'BAD_REQUEST',
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  notFound: 'NOT_FOUND',
  conflict: 'CONFLICT',
  internalServerError: 'INTERNAL_SERVER_ERROR',
} as const

export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes]
