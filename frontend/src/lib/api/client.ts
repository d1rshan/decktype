import { edenTreaty } from '@elysiajs/eden'
import type { Elysia } from 'elysia'

import type { App } from '../../../../backend/app.ts'

type AppContract = Elysia<any, any, any, any, App['~Routes'], any, any>

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000'

export const api = edenTreaty<AppContract>(backendUrl, {
  $fetch: {
    credentials: 'include',
  },
})

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

const getApiErrorMessage = (error: EdenFailure['error']) => {
  if (typeof error.value === 'string') {
    return error.value
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

export const unwrapEdenResponse = <T>(
  response: EdenSuccess<T> | EdenFailure,
) => {
  if (response.error) {
    throw new Error(getApiErrorMessage(response.error))
  }

  return response.data
}
