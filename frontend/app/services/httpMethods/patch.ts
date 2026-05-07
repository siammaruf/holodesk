import httpService from '../httpService'

export function patch<T>(url: string, data?: any): Promise<T> {
  return httpService.patch(url, data).then((res) => res.data)
}
