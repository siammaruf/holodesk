import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { store } from '~/redux/store/store'
import { queryClient } from '~/lib/queryClient'
import { AuthProvider } from '~/hooks/useAuth'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  )
}
