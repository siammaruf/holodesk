import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '~/redux/features/authSlice'
import userReducer from '~/redux/features/userSlice'
import counterReducer from '~/redux/features/counterSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  counter: counterReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer