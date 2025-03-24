
import React from 'react'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricDisplayProps {
  value: string | number
  label?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string | number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  trendLabel?: string
  invertTrendColors?: boolean
}

export function MetricDisplay({
  value,
  label,
  trend,
  trendValue,
  size = 'md',
  className,
  trendLabel,
  invertTrendColors = false,
}: MetricDisplayProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }

  const getTrendIcon = () => {
    if (trend === 'up') {
      return <ArrowUp className="h-4 w-4" />
    }
    if (trend === 'down') {
      return <ArrowDown className="h-4 w-4" />
    }
    return <Minus className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground'
    
    if (invertTrendColors) {
      return trend === 'up' 
        ? 'text-destructive' 
        : trend === 'down' 
        ? 'text-success' 
        : 'text-muted-foreground'
    }

    return trend === 'up' 
      ? 'text-success' 
      : trend === 'down' 
      ? 'text-destructive' 
      : 'text-muted-foreground'
  }

  return (
    <div className={cn('flex flex-col space-y-1', className)}>
      <div className={cn('font-semibold leading-none tracking-tight', sizeClasses[size])}>
        {value}
      </div>
      
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
      
      {trend && (
        <div className={cn('flex items-center gap-1 text-xs', getTrendColor())}>
          {getTrendIcon()}
          {trendValue && <span>{trendValue}</span>}
          {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
