import httpService from '../httpService'

export function post<T>(url: string, data?: any): Promise<T> {
  return httpService.post(url, data).then((res) => res.data)
}
