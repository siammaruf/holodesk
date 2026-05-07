import type { AxiosInstance } from 'axios'

export function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid - redirect to login
        window.location.href = '/signin'
      }
      return Promise.reject(error)
    }
  )
}
