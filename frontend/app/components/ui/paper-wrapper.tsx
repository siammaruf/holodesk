import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"
import { SuspenseLoader } from "./suspense-loader"

const paperWrapperVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      padding: "default",
    },
  }
)

interface PaperWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paperWrapperVariants> {
  loading?: boolean
  loadingMessage?: string
  error?: Error | null
  errorTitle?: string
  empty?: boolean
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  onRetry?: () => void
}

function PaperWrapper({
  className,
  padding,
  loading = false,
  loadingMessage = "Loading...",
  error = null,
  errorTitle = "Something went wrong",
  empty = false,
  emptyMessage = "No data available",
  emptyIcon,
  onRetry,
  children,
  ...props
}: PaperWrapperProps) {
  const renderContent = () => {
    if (loading) {
      return <SuspenseLoader message={loadingMessage} />
    }

    if (error) {
      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-center">
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
            <h3 className="font-semibold text-foreground">{errorTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              Try again
            </button>
          )}
        </div>
      )
    }

    if (empty) {
      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-center">
          {emptyIcon ?? (
            <div className="rounded-full bg-muted p-3">
              <svg
                className="size-6 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
          )}
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      )
    }

    return children
  }

  return (
    <div
      className={cn(paperWrapperVariants({ padding, className }))}
      {...props}
    >
      {renderContent()}
    </div>
  )
}

export { PaperWrapper, paperWrapperVariants }
