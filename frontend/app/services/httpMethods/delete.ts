import httpService from '../httpService'

export function del<T>(url: string): Promise<T> {
  return httpService.delete(url).then((res) => res.data)
}
