import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const loadingOverlayVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-background/80 backdrop-blur-sm",
        transparent: "bg-transparent",
        solid: "bg-background",
      },
      size: {
        default: "",
        fullScreen: "fixed inset-0 z-50",
        container: "absolute inset-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "container",
    },
  }
)

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "size-4",
        default: "size-8",
        lg: "size-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface LoadingOverlayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingOverlayVariants> {
  isLoading?: boolean
  message?: string
  spinnerSize?: "sm" | "default" | "lg"
}

function LoadingOverlay({
  className,
  variant,
  size,
  isLoading = true,
  message,
  spinnerSize = "default",
  children,
  ...props
}: LoadingOverlayProps) {
  if (!isLoading) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {children}
      <div
        className={cn(loadingOverlayVariants({ variant, size, className }))}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              spinnerVariants({ size: spinnerSize }),
              "text-primary"
            )}
          />
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export { LoadingOverlay, loadingOverlayVariants }
