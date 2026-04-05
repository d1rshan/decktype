import { edenTreaty } from '@elysiajs/eden'
import type { Elysia } from 'elysia'

import type { App } from '../../../backend/src/app/create-app.ts'
import { toast } from '@/lib/toast'

type AppContract = Elysia<any, any, any, any, App['~Routes'], any, any>

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000'

const treaty = edenTreaty<AppContract>(backendUrl, {
  $fetch: {
    credentials: 'include',
  },
})

export const { api } = treaty

type EdenSuccess<T> = {
  data: T
  error: null
}

type EdenFailure = {
  data: null
  error: {
    status: unknown
    value: unknown
  }
}

type ApiErrorBody = {
  code?: unknown
  message?: unknown
}

const getApiErrorBody = (error: EdenFailure['error']): ApiErrorBody | null => {
  if (!error.value || typeof error.value !== 'object') {
    return null
  }

  return error.value as ApiErrorBody
}

const getApiErrorMessage = (error: EdenFailure['error']) => {
  if (typeof error.value === 'string') {
    return error.value
  }

  const body = getApiErrorBody(error)

  if (typeof body?.message === 'string') {
    return body.message
  }

  if (error.value && typeof error.value === 'object' && 'error' in error.value) {
    const message = error.value.error

    if (typeof message === 'string') {
      return message
    }
  }

  if (typeof error.status === 'number') {
    return `Request failed with status ${error.status}`
  }

  return 'Request failed.'
}

export class ApiClientError extends Error {
  readonly status?: number
  readonly code?: string
  readonly causeValue: unknown

  constructor(error: EdenFailure['error'] | { message: string; causeValue: unknown }) {
    super('status' in error ? getApiErrorMessage(error) : error.message)
    const body = 'status' in error ? getApiErrorBody(error) : null

    this.name = 'ApiClientError'
    this.status =
      'status' in error && typeof error.status === 'number'
        ? error.status
        : undefined
    this.code = typeof body?.code === 'string' ? body.code : undefined
    this.causeValue = 'status' in error ? error.value : error.causeValue
  }
}

export const unwrapEdenResponse = <T>(
  response: EdenSuccess<T> | EdenFailure,
) => {
  if (response.error) {
    throw new ApiClientError(response.error)
  }

  return response.data
}

export const request = async <T>(
  promise: Promise<EdenSuccess<T> | EdenFailure>,
) => {
  try {
    const response = await promise

    return unwrapEdenResponse(response)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }

    if (error instanceof Error) {
      throw new ApiClientError({
        message: 'Unable to reach the server.',
        causeValue: error,
      })
    }

    throw new ApiClientError({
      message: 'Unable to reach the server.',
      causeValue: error,
    })
  }
}

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiClientError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  if (typeof error === 'string' && error.trim()) {
    return error
  }

  return fallback
}

export const toastApiError = (error: unknown, fallback: string) => {
  const message = getErrorMessage(error, fallback)

  toast.error(message)

  return message
}
