import type { AxiosInstance } from 'axios'

export function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const requestUrl = error.config?.url || ''

        // Skip redirect for auth status checks (expected to 401 when logged out)
        if (requestUrl.includes('/auth/me')) {
          return Promise.reject(error)
        }

        // Token expired or invalid - redirect to login unless already there
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin'
        }
      }
      return Promise.reject(error)
    }
  )
}
