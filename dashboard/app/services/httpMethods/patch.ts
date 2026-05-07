import httpService from '../httpService'
import type { AxiosRequestConfig } from 'axios'

export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await httpService.patch<T>(url, data, config)
  return response.data
}
