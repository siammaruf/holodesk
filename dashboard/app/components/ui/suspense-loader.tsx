import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const suspenseLoaderVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "min-h-[100px]",
        default: "min-h-[200px]",
        lg: "min-h-[400px]",
        fullScreen: "min-h-screen",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent text-primary",
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

interface SuspenseLoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof suspenseLoaderVariants> {
  message?: string
  spinnerSize?: "sm" | "default" | "lg"
}

function SuspenseLoader({
  className,
  size,
  message,
  spinnerSize,
  ...props
}: SuspenseLoaderProps) {
  const resolvedSpinnerSize = spinnerSize ?? (size === "sm" ? "sm" : size === "lg" ? "lg" : "default")

  return (
    <div
      className={cn(suspenseLoaderVariants({ size, className }))}
      {...props}
    >
      <div className="flex flex-col items-center gap-3">
        <div className={cn(spinnerVariants({ size: resolvedSpinnerSize }))} />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  )
}

export { SuspenseLoader, suspenseLoaderVariants }
