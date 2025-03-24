
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface DataCardProps {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  loading?: boolean
  size?: 'default' | 'medium' | 'large'
}

export function DataCard({
  title,
  children,
  footer,
  className,
  loading = false,
  size = 'default',
}: DataCardProps) {
  const sizeClass = {
    default: 'dashboard-card',
    medium: 'dashboard-card-md',
    large: 'dashboard-card-lg',
  }[size]

  if (loading) {
    return (
      <Card className={cn(sizeClass, 'hover-lift', className)}>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </CardContent>
        {footer && (
          <CardFooter className="pt-0">
            <Skeleton className="h-4 w-full" />
          </CardFooter>
        )}
      </Card>
    )
  }

  return (
    <Card className={cn(sizeClass, 'hover-lift', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-4">{children}</CardContent>
      {footer && <CardFooter className="pt-0 text-xs text-muted-foreground">{footer}</CardFooter>}
    </Card>
  )
}
