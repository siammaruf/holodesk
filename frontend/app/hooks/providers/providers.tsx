import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { store } from '~/redux/store/store'
import { queryClient } from '~/lib/queryClient'
import { AuthInitializer } from '~/components/auth/AuthInitializer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthInitializer>{children}</AuthInitializer>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
