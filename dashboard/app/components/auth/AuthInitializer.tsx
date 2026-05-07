import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import { getCurrentUser } from '~/redux/features/authSlice'
import { SuspenseLoader } from '~/components/ui/suspense-loader'

interface AuthInitializerProps {
  children: React.ReactNode
}

/**
 * Checks authentication status on app load.
 * Shows loading state while verifying session via httpOnly cookie.
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch()
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  // Show loading state during initial auth check
  if (loading && !isAuthenticated) {
    return <SuspenseLoader size="fullScreen" message="Loading..." />
  }

  return <>{children}</>
}
