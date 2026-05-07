import httpService from '../httpService'

export function get<T>(url: string, params?: Record<string, any>): Promise<T> {
  return httpService.get(url, { params }).then((res) => res.data)
}
