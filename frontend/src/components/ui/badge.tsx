import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] whitespace-nowrap transition-colors duration-150 outline-none focus-visible:outline-1 focus-visible:outline-ring focus-visible:outline-offset-2 aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-primary/60 bg-primary text-primary-foreground [a]:hover:brightness-110",
        secondary:
          "border-border bg-secondary text-secondary-foreground [a]:hover:bg-muted",
        destructive:
          "border-destructive/60 bg-destructive/10 text-destructive [a]:hover:bg-destructive/20",
        outline:
          "border-border bg-transparent text-foreground [a]:hover:bg-muted",
        ghost:
          "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        link: "border-transparent text-info normal-case tracking-normal underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
