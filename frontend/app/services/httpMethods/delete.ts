import httpService from '../httpService'
import type { AxiosRequestConfig } from 'axios'

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await httpService.delete<T>(url, config)
  return response.data
}
