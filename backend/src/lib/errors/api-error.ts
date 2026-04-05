import type { ErrorCode } from './error-codes'

export class ApiError extends Error {
  readonly status: number
  readonly code: ErrorCode

  constructor(options: {
    status: number
    code: ErrorCode
    message: string
  }) {
    super(options.message)

    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
  }
}
