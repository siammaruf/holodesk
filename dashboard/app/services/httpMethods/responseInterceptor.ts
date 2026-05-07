import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { createErrorResponse } from '~/utils/errorHandler'
import type { ApiError } from '~/types/api'

export function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiError>) => {
      const errorResponse = createErrorResponse(error)
      return Promise.reject(errorResponse)
    }
  )
}
