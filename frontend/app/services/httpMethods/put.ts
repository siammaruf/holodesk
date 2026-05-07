import httpService from '../httpService'
import type { AxiosRequestConfig } from 'axios'

export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await httpService.put<T>(url, data, config)
  return response.data
}
