export function getFirstValidationMessage(errors: unknown[]) {
  for (const error of errors) {
    if (typeof error === 'string' && error.trim()) {
      return error
    }

    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message?: unknown }).message

      if (typeof message === 'string' && message.trim()) {
        return message
      }
    }
  }

  return null
}
