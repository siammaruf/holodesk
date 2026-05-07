import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "min-h-[100px] gap-2",
        default: "min-h-[200px] gap-4",
        lg: "min-h-[400px] gap-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}

function EmptyState({
  className,
  size,
  icon,
  title,
  description,
  action,
  children,
  ...props
}: EmptyStateProps) {
  const defaultIcon = (
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
  )

  return (
    <div
      className={cn(emptyStateVariants({ size, className }))}
      {...props}
    >
      {icon ?? defaultIcon}
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="font-semibold text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {action && <div className="mt-2">{action}</div>}
      {children}
    </div>
  )
}

export { EmptyState, emptyStateVariants }
