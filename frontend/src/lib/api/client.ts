import { edenTreaty } from '@elysiajs/eden'
import type { Elysia } from 'elysia'

import type { App } from '../../../../backend/src/app/create-app.ts'

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

  constructor(error: EdenFailure['error']) {
    super(getApiErrorMessage(error))
    const body = getApiErrorBody(error)

    this.name = 'ApiClientError'
    this.status = typeof error.status === 'number' ? error.status : undefined
    this.code = typeof body?.code === 'string' ? body.code : undefined
    this.causeValue = error.value
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
