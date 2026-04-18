import { edenTreaty } from '@elysiajs/eden'
import type { Elysia } from 'elysia'

import type { App } from '../../../backend/src/app/create-app.ts'
import { backendUrl } from '@/lib/backend-url'
import { toast } from '@/lib/toast'

type AppContract = Elysia<any, any, any, any, App['~Routes'], any, any>

const treaty = edenTreaty<AppContract>(backendUrl, {
  $fetch: {
    credentials: 'include',
  },
})

export const { api } = treaty

const DEFAULT_ERROR_MESSAGE = 'Something went wrong.'

export class ApiError extends Error {
  readonly status?: number
  readonly code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

// Eden response contract used by frontend:
// - success: { data, error: null }
// - server error: { data: null, error: { status, value: { code, message } } }
// - network failure: promise rejects
export const unwrap = async <T>(
  promise: Promise<{ data: T | null; error: any }>,
): Promise<T> => {
  let response: { data: T | null; error: any }

  try {
    response = await promise
  }
  catch {
    throw new ApiError('Unable to reach the server.')
  }

  const { data, error } = response

  if (error) {
    const body = error.value
    const message =
      (typeof body === 'object' && isNonEmptyString(body?.message) && body.message) ||
      (typeof body === 'object' && isNonEmptyString(body?.error) && body.error) ||
      (isNonEmptyString(body) ? body : DEFAULT_ERROR_MESSAGE)

    throw new ApiError(String(message), error.status, body?.code)
  }

  return data as T
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && isNonEmptyString(error.message)) {
    return error.message
  }

  if (isNonEmptyString(error)) {
    return error
  }

  return DEFAULT_ERROR_MESSAGE
}

export const toastApiError = (error: unknown) => {
  const message = getErrorMessage(error)
  toast.error(message)
  return message
}
