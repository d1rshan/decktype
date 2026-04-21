import { createAuthClient } from 'better-auth/solid'

import { backendUrl } from '@/lib/backend-url'

export const authClient = createAuthClient({
  baseURL: backendUrl,
  fetchOptions: {
    credentials: 'include',
  },
})
