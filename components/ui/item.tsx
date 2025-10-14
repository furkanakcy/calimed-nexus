import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const itemVariants = cva(
  "group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a&]:hover:bg-accent/50 [a&]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[3px]",
  {
    variants: {
      size: {
        default: "gap-2 px-2 py-1.5",
        sm: "gap-1.5 px-1.5 py-1 text-xs",
        lg: "gap-2.5 px-2.5 py-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof itemVariants> {}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(({ className, size, ...props }, ref) => {
  return <div ref={ref} data-slot="item" className={cn(itemVariants({ size, className }))} {...props} />
})
Item.displayName = "Item"

const ItemVisual = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="item-visual"
        className={cn(
          "[.group\\/item_&]:text-muted-foreground flex shrink-0 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    )
  },
)
ItemVisual.displayName = "ItemVisual"

const ItemLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="item-label"
        className={cn("flex flex-1 flex-col gap-0.5 overflow-hidden", className)}
        {...props}
      />
    )
  },
)
ItemLabel.displayName = "ItemLabel"

const ItemTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} data-slot="item-title" className={cn("truncate font-medium leading-none", className)} {...props} />
    )
  },
)
ItemTitle.displayName = "ItemTitle"

const ItemDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="item-description"
        className={cn("text-muted-foreground line-clamp-2 text-xs leading-snug", className)}
        {...props}
      />
    )
  },
)
ItemDescription.displayName = "ItemDescription"

export { Item, ItemVisual, ItemLabel, ItemTitle, ItemDescription }
