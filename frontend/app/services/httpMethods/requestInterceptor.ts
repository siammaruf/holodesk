import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

export function setupRequestInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Token is handled via httpOnly cookies - no manual injection needed
      return config
    },
    (error) => Promise.reject(error)
  )
}
