
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ChartContainerProps {
  children: React.ReactNode
  loading?: boolean
  className?: string
  height?: number
  noData?: boolean
}

export function ChartContainer({
  children,
  loading = false,
  className,
  height = 300,
  noData = false,
}: ChartContainerProps) {
  if (loading) {
    return (
      <div
        style={{ height: `${height}px` }}
        className={cn('w-full flex items-center justify-center animate-pulse', className)}
      >
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  if (noData) {
    return (
      <div
        style={{ height: `${height}px` }}
        className={cn('w-full flex flex-col items-center justify-center text-muted-foreground', className)}
      >
        <p>No data available</p>
        <p className="text-xs">Try adjusting your filters or check back later</p>
      </div>
    )
  }

  return (
    <div 
      style={{ height: `${height}px` }} 
      className={cn('w-full chart-container', className)}
    >
      {children}
    </div>
  )
}
