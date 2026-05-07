import { get, post, put, del } from '../httpMethods'
import type { User } from '~/types/user'

export const userService = {
  getUsers: () =>
    get<User[]>('/users'),

  getUserById: (id: number) =>
    get<User>(`/users/${id}`),

  createUser: (user: Omit<User, 'id'>) =>
    post<User>('/users', user),

  updateUser: (id: number, user: Partial<User>) =>
    put<User>(`/users/${id}`, user),

  deleteUser: (id: number) =>
    del<void>(`/users/${id}`),
}
