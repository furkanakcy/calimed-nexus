import * as React from "react"

import { cn } from "@/lib/utils"

const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="input-group"
        className={cn(
          "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",
          "border-input dark:bg-input/30 flex h-9 w-full items-center overflow-hidden rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:opacity-50 md:text-sm",
          className,
        )}
        {...props}
      />
    )
  },
)
InputGroup.displayName = "InputGroup"

const InputGroupControl = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-slot="input-group-control"
        className={cn(
          "placeholder:text-muted-foreground flex-1 bg-transparent px-3 py-1 outline-none disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    )
  },
)
InputGroupControl.displayName = "InputGroupControl"

const InputGroupAddon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="input-group-addon"
        className={cn(
          "text-muted-foreground flex items-center px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    )
  },
)
InputGroupAddon.displayName = "InputGroupAddon"

export { InputGroup, InputGroupControl, InputGroupAddon }
