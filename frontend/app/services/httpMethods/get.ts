import httpService from '../httpService'
import type { AxiosRequestConfig } from 'axios'

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await httpService.get<T>(url, config)
  return response.data
}
