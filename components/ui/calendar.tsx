"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker, useDayPicker, type DayPickerProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = DayPickerProps

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const { selected } = useDayPicker() // Moved useDayPicker hook to the top level

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "gap-1 flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1",
        ),
        month_grid: "w-full border-collapse gap-2",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-(--cell-size) font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          "group relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring has-focus:ring-[3px] rounded-md",
          "p-0 size-(--cell-size) text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].range-end)]:rounded-r-md [&:has([aria-selected].range-middle)]:rounded-none [&:has([aria-selected].range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        ),
        day_button: cn(
          "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
          "size-full items-center justify-center p-0 font-normal aria-selected:opacity-100 rounded-md",
        ),
        range_end: "range-end",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground range-middle",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon
          return <Icon className="size-4" />
        },
        DayButton: ({ day, modifiers, ...props }) => {
          const buttonRef = React.useRef<HTMLButtonElement>(null)
          const isStart = selected && "from" in selected && day.isEqualTo(selected.from)
          const isEnd = selected && "to" in selected && day.isEqualTo(selected.to)
          const isMiddle =
            selected &&
            "from" in selected &&
            "to" in selected &&
            selected.from &&
            selected.to &&
            day.isAfter(selected.from) &&
            day.isBefore(selected.to)
          const isSingle = selected && "isEqualTo" in selected && day.isEqualTo(selected)

          return (
            <button
              ref={buttonRef}
              {...props}
              type="button"
              data-selected-single={isSingle}
              data-range-start={isStart}
              data-range-end={isEnd}
              data-range-middle={isMiddle}
            />
          )
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
