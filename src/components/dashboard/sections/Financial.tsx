
import React, { useContext, useEffect, useState } from 'react'
import { DashboardContext } from '../Layout'
import { DataCard } from '@/components/ui/data-card'
import { ChartContainer } from '@/components/ui/chart-container'
import { MetricDisplay } from '@/components/ui/metric-display'
import { 
  api, 
  RevenueComparisonData, 
  ShippingCostData, 
  LogisticsCostEvolutionData,
  LogisticsCostRatioData
} from '@/lib/api'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { TrendingUp, Truck, DollarSign, PercentCircle } from 'lucide-react'
import { subDays, format } from 'date-fns'

export function FinancialSection() {
  const { activityCode, dateRange } = useContext(DashboardContext)

  // States for the metrics
  const [revenueComparison, setRevenueComparison] = useState<RevenueComparisonData | null>(null)
  const [shippingCost, setShippingCost] = useState<ShippingCostData | null>(null)
  const [costEvolution, setCostEvolution] = useState<LogisticsCostEvolutionData | null>(null)
  const [costRatio, setCostRatio] = useState<LogisticsCostRatioData | null>(null)
  const [loading, setLoading] = useState({
    revenue: true,
    shipping: true,
    costEvolution: true,
    costRatio: true
  })

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading({
        revenue: true,
        shipping: true,
        costEvolution: true,
        costRatio: true
      })
      
      try {
        // For this demo, we'll use mock data
        const revenueData = api.mockApi.getRevenueComparison()
        const shippingData = api.mockApi.getShippingCost()
        const evolutionData = api.mockApi.getLogisticsCostEvolution()
        const ratioData = api.mockApi.getLogisticsCostToRevenueRatio()
        
        setRevenueComparison(revenueData)
        setShippingCost(shippingData)
        setCostEvolution(evolutionData)
        setCostRatio(ratioData)
      } catch (error) {
        console.error('Error fetching financial data:', error)
      } finally {
        // Add a small delay to simulate network request
        setTimeout(() => {
          setLoading({
            revenue: false,
            shipping: false,
            costEvolution: false,
            costRatio: false
          })
        }, 800)
      }
    }
    
    fetchData()
  }, [activityCode, dateRange])

  // Calculate previous period for display
  const previousPeriodStart = format(subDays(new Date(dateRange.startDate), 7), 'yyyy-MM-dd')
  const previousPeriodEnd = format(subDays(new Date(dateRange.endDate), 7), 'yyyy-MM-dd')

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Revenue Comparison */}
        <DataCard 
          title="Revenue Comparison" 
          loading={loading.revenue}
          size="medium"
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp size={14} className="mr-1" />
              <span>Current vs. previous period revenue</span>
            </div>
          }
        >
          {revenueComparison && (
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <MetricDisplay
                  value={formatCurrency(revenueComparison.currentPeriod.revenue)}
                  label="Current Period"
                  trend={revenueComparison.percentageChange > 0 ? 'up' : 'down'}
                  trendValue={`${revenueComparison.percentageChange > 0 ? '+' : ''}${formatPercent(revenueComparison.percentageChange)}`}
                />
                <MetricDisplay
                  value={formatCurrency(revenueComparison.previousPeriod.revenue)}
                  label="Previous Period"
                  size="sm"
                />
              </div>
              
              <ChartContainer height={250}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueComparison.dailyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => value.split('-')[2]} // Just show the day
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Legend />
                    <Bar 
                      name="Current Period" 
                      dataKey="currentRevenue" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      name="Previous Period" 
                      dataKey="previousRevenue" 
                      fill="hsl(var(--muted))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </DataCard>

        {/* Shipping Cost */}
        <DataCard 
          title="Shipping Cost Breakdown" 
          loading={loading.shipping}
          size="medium"
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <Truck size={14} className="mr-1" />
              <span>Distribution of shipping costs by carrier and destination</span>
            </div>
          }
        >
          {shippingCost && (
            <div className="flex flex-col space-y-4">
              <MetricDisplay
                value={formatCurrency(shippingCost.totalCost)}
                label="Total shipping cost"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">By Carrier</h4>
                  <ChartContainer height={180}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={shippingCost.byCarrier}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="cost"
                          nameKey="carrier"
                        >
                          {shippingCost.byCarrier.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Cost']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">By Destination</h4>
                  <ChartContainer height={180}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={shippingCost.byDestination}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="cost"
                          nameKey="destination"
                        >
                          {shippingCost.byDestination.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Cost']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>
          )}
        </DataCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logistics Cost Evolution */}
        <DataCard 
          title="Logistics Cost Evolution" 
          loading={loading.costEvolution}
          size="medium"
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <DollarSign size={14} className="mr-1" />
              <span>Daily logistics costs over time</span>
            </div>
          }
        >
          {costEvolution && (
            <div className="flex flex-col space-y-4">
              <ChartContainer height={280}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={costEvolution.totalCosts}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => value.split('-')[2]} // Just show the day
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Cost']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div>
                <h4 className="text-sm font-medium mb-2">Cost Categories</h4>
                <div className="space-y-2">
                  {costEvolution.byCategory.map((category, index) => (
                    <div key={category.category} className="flex justify-between items-center">
                      <span className="text-sm">{category.category}</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(category.costs[category.costs.length - 1].cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DataCard>

        {/* Logistics Cost to Revenue Ratio */}
        <DataCard 
          title="Logistics Cost to Revenue Ratio" 
          loading={loading.costRatio}
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <PercentCircle size={14} className="mr-1" />
              <span>Logistics costs as percentage of revenue</span>
            </div>
          }
        >
          {costRatio && (
            <div className="flex flex-col space-y-4">
              <MetricDisplay
                value={formatPercent(costRatio.ratio)}
                trend={costRatio.trend === 'down' ? 'down' : 'up'}
                label="Cost to revenue ratio"
                invertTrendColors={true}
              />
              
              <ChartContainer height={180}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={costRatio.historical}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => value.split('-')[2]} // Just show the day
                    />
                    <YAxis domain={[20, 30]} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Ratio']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ratio" 
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
      </div>
    </div>
  )
}
