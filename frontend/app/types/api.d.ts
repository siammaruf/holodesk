export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export interface AuthUser {
  id: number
  email: string
  name: string
}

export interface LoginResponse {
  user: AuthUser
  tokens: AuthTokens
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface VerifyOtpRequest {
  otp: string
  email: string
}

// Form Action Response Types (for server actions)
export interface FormActionResponse<T = unknown> {
  message?: string
  error?: string
  data?: T
}

export type LoginFormResponse = FormActionResponse<{
  username: string
  password: string
  rememberMe?: boolean
}>

export type RegisterFormResponse = FormActionResponse<{
  email: string
  password: string
  name?: string
}>
