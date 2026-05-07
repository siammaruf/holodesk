import httpService from '../httpService'

export function put<T>(url: string, data?: any): Promise<T> {
  return httpService.put(url, data).then((res) => res.data)
}
