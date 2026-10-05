import * as React from "react"
import { cn } from "@/lib/utils"

function Prompt({
  children,
  caret = false,
  className,
}: {
  children: React.ReactNode
  caret?: boolean
  className?: string
}) {
  return (
    <span
      data-slot="prompt"
      className={cn(
        "inline-flex items-baseline font-mono text-sm text-foreground",
        className
      )}
    >
      <span aria-hidden="true" className="mr-[0.5ch] text-primary">
        $
      </span>
      <span>{children}</span>
      {caret ? (
        <span aria-hidden="true" className="animate-caret ml-[0.25ch] text-primary">
          ▮
        </span>
      ) : null}
    </span>
  )
}

export { Prompt }
