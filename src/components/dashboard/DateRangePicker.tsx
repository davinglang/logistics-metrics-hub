
import React, { useContext, useState } from 'react'
import { DashboardContext } from './Layout'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function DateRangePicker() {
  const { dateRange, setDateRange } = useContext(DashboardContext)
  const [date, setDate] = useState<{
    from: Date | undefined
    to?: Date | undefined
  }>({
    from: new Date(dateRange.startDate),
    to: new Date(dateRange.endDate),
  })

  const displayText = date.from
    ? date.to
      ? `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`
      : format(date.from, "MMM d, yyyy")
    : "Select date range"

  const handleSelect = (value: { from: Date; to?: Date }) => {
    setDate(value)
    
    if (value.from && value.to) {
      setDateRange({
        startDate: format(value.from, 'yyyy-MM-dd'),
        endDate: format(value.to, 'yyyy-MM-dd'),
      })
    }
  }

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
