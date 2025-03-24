
import React, { useContext, useEffect, useState } from 'react'
import { DashboardContext } from '../Layout'
import { DataCard } from '@/components/ui/data-card'
import { ChartContainer } from '@/components/ui/chart-container'
import { MetricDisplay } from '@/components/ui/metric-display'
import { api, PreparationTimeData, PiecesPerWorkerData, OnTimePreparationData } from '@/lib/api'
import { formatDuration, formatPercent } from '@/lib/utils'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'
import { Clock, Users, CheckCircle } from 'lucide-react'

export function ProductivitySection() {
  const { activityCode, dateRange } = useContext(DashboardContext)

  // States for the metrics
  const [preparationTime, setPreparationTime] = useState<PreparationTimeData | null>(null)
  const [piecesPerWorker, setPiecesPerWorker] = useState<PiecesPerWorkerData | null>(null)
  const [onTimeRate, setOnTimeRate] = useState<OnTimePreparationData | null>(null)
  const [loading, setLoading] = useState({
    prepTime: true,
    piecesPerWorker: true,
    onTimeRate: true
  })

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading({
        prepTime: true,
        piecesPerWorker: true,
        onTimeRate: true
      })
      
      try {
        // In a real implementation, we would use actual API calls
        // For this demo, we'll use mock data
        const prepTimeData = api.mockApi.getAveragePreparationTime()
        const piecesData = api.mockApi.getPiecesPerWorker()
        const onTimeData = api.mockApi.getOnTimePreparationRate()
        
        setPreparationTime(prepTimeData)
        setPiecesPerWorker(piecesData)
        setOnTimeRate(onTimeData)
      } catch (error) {
        console.error('Error fetching productivity data:', error)
      } finally {
        // Add a small delay to simulate network request
        setTimeout(() => {
          setLoading({
            prepTime: false,
            piecesPerWorker: false,
            onTimeRate: false
          })
        }, 800)
      }
    }
    
    fetchData()
  }, [activityCode, dateRange])

  // Prepare data for time chart
  const timeChartData = preparationTime?.dailyData.map(item => ({
    date: item.date.split('-')[2], // Just show the day for brevity
    time: item.timeMinutes
  }))

  // Prepare trend value display
  const prepTimeTrendValue = preparationTime?.previousPeriodAverage 
    ? `${Math.abs(preparationTime.previousPeriodAverage - preparationTime.averageTimeMinutes).toFixed(1)} min`
    : undefined

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Preparation Time */}
        <DataCard 
          title="Average Preparation Time" 
          loading={loading.prepTime}
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock size={14} className="mr-1" />
              <span>Time per order preparation</span>
            </div>
          }
        >
          {preparationTime && (
            <div className="flex flex-col space-y-4">
              <MetricDisplay
                value={formatDuration(preparationTime.averageTimeMinutes)}
                trend={preparationTime.trend}
                trendValue={prepTimeTrendValue}
                trendLabel="vs. previous period"
                invertTrendColors={true}
              />
              
              <ChartContainer height={180}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value} min`, 'Prep Time']}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="time" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </DataCard>

        {/* Pieces per Worker */}
        <DataCard 
          title="Pieces per Worker" 
          loading={loading.piecesPerWorker}
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <Users size={14} className="mr-1" />
              <span>Average pieces processed per worker</span>
            </div>
          }
        >
          {piecesPerWorker && (
            <div className="flex flex-col space-y-4">
              <MetricDisplay
                value={piecesPerWorker.average.toFixed(0)}
                label="pieces per worker"
              />
              
              <ChartContainer height={180}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={piecesPerWorker.byTeam}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="teamName" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value} pieces`, 'Per Worker']}
                    />
                    <Bar 
                      dataKey="piecesPerWorker" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </DataCard>

        {/* On-Time Preparation Rate */}
        <DataCard 
          title="On-Time Preparation Rate" 
          loading={loading.onTimeRate}
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle size={14} className="mr-1" />
              <span>Percentage of orders prepared on time</span>
            </div>
          }
        >
          {onTimeRate && (
            <div className="flex flex-col space-y-4">
              <MetricDisplay
                value={formatPercent(onTimeRate.rate)}
                trend={onTimeRate.trend}
                label="on-time rate"
              />
              
              <ChartContainer height={180}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={onTimeRate.historical}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => value.split('-')[2]} // Just show the day
                    />
                    <YAxis domain={[85, 100]} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'On-Time Rate']}
                      labelFormatter={(label) => label}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="hsl(var(--success))" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </DataCard>
      </div>
    </div>
  )
}
