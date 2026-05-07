import * as React from "react"

import { cn } from "~/lib/utils"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          className={cn(
            "flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border bg-card p-6 text-center",
            this.props.className
          )}
        >
          <div className="rounded-full bg-destructive/10 p-3">
            <svg
              className="size-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Something went wrong</h3>
            {this.state.error && (
              <p className="mt-1 text-sm text-muted-foreground">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for easier use with hooks
interface ErrorBoundaryWrapperProps extends Omit<ErrorBoundaryProps, "children"> {
  children: React.ReactNode
}

function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

export { ErrorBoundary, withErrorBoundary }
export type { ErrorBoundaryProps }
