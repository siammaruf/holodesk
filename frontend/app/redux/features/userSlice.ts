import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '~/services'
import type { User, UserState } from '~/types/user'
import type { ApiError } from '~/types/api'

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
}

// Thunks
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getUsers()
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await userService.getUserById(id)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      return await userService.createUser(userData)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, data }: { id: number; data: Partial<User> }, { rejectWithValue }) => {
    try {
      return await userService.updateUser(id, data)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id)
      return id
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch User By Id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex((u) => u.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter((u) => u.id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearSelectedUser } = userSlice.actions
export default userSlice.reducer
