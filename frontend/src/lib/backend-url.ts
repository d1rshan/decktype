export const backendUrl = import.meta.env.PROD
  ? window.location.origin
  : 'http://localhost:3000'

export const apiBaseUrl = `${backendUrl}/api`
