import { get, post } from '../httpMethods'
import type {
  LoginCredentials,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from '~/types/api'

export const authService = {
  login: (credentials: LoginCredentials) =>
    post<LoginResponse>('/auth/login', credentials),

  logout: () =>
    post<void>('/auth/logout'),

  refreshToken: () =>
    post<{ accessToken: string }>('/auth/refresh'),

  forgotPassword: (data: ForgotPasswordRequest) =>
    post<{ message: string }>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    post<{ message: string }>('/auth/reset-password', data),

  verifyOtp: (data: VerifyOtpRequest) =>
    post<{ verified: boolean }>('/auth/verify-otp', data),

  getCurrentUser: () =>
    get<LoginResponse['user']>('/auth/me'),
}
