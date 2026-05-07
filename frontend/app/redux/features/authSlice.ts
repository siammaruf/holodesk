import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '~/services'
import type { AuthUser, LoginCredentials, ApiError } from '~/types/api'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      // Token is stored in httpOnly cookie by the server
      return response.user
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Server clears the httpOnly cookie on logout
      await authService.logout()
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser()
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.error = action.payload as string
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setAuthenticated } = authSlice.actions
export default authSlice.reducer
