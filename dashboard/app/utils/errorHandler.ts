import type { AxiosError } from 'axios'
import type { ApiError } from '~/types/api'

/**
 * Create a standardized error response from an Axios error
 */
export const createErrorResponse = (error: AxiosError<ApiError>): ApiError => {
  const errorResponse: ApiError = {
    message: 'An unexpected error occurred',
    status: 500,
  }

  if (error.response) {
    errorResponse.status = error.response.status
    errorResponse.message = error.response.data?.message || error.message
    errorResponse.errors = error.response.data?.errors

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      handleUnauthorized()
    }
  } else if (error.request) {
    errorResponse.message = 'No response from server'
    errorResponse.status = 503
  }

  return errorResponse
}

/**
 * Handle unauthorized access
 */
export const handleUnauthorized = (): void => {
  // Cookies are cleared by the server on logout
  window.location.href = '/login'
}

/**
 * Check if an error is an API error
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  )
}

/**
 * Get error message from an unknown error
 */
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

/**
 * Get error status from an unknown error
 */
export const getErrorStatus = (error: unknown): number => {
  if (isApiError(error)) {
    return error.status
  }
  return 500
}

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (
  errors: Record<string, string[]> | undefined
): Record<string, string> => {
  if (!errors) return {}

  const formatted: Record<string, string> = {}
  for (const [key, messages] of Object.entries(errors)) {
    formatted[key] = messages[0] || 'Invalid value'
  }
  return formatted
}
