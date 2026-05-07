export type UserStatus = 'Active' | 'Inactive' | 'Suspended'

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  position?: string
  status?: UserStatus
  startDate?: string
}

export interface UserState {
  users: User[]
  selectedUser: User | null
  loading: boolean
  error: string | null
}

export interface CreateUserRequest {
  name: string
  email: string
  phone?: string
  position: string
  status?: UserStatus
  startDate: string
}