import { createAuthClient } from 'better-auth/solid'

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000'

export const authClient = createAuthClient({
  baseURL: backendUrl,
})
