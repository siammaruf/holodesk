import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // Data fresh for 1 minute
      gcTime: 5 * 60 * 1000,       // Cache cleanup after 5 minutes
      retry: 2,                    // Retry failed requests twice
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  },
})
