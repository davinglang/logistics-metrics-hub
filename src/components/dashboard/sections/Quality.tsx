
import React, { useContext, useEffect, useState } from 'react'
import { DashboardContext } from '../Layout'
import { DataCard } from '@/components/ui/data-card'
import { ChartContainer } from '@/components/ui/chart-container'
import { MetricDisplay } from '@/components/ui/metric-display'
import { api, DefectRateData, ReturnsAnalysisData } from '@/lib/api'
import { formatNumber, formatPercent } from '@/lib/utils'
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { AlertTriangle, RotateCw } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function QualitySection() {
  const { activityCode, dateRange } = useContext(DashboardContext)

  // States for the metrics
  const [defectRate, setDefectRate] = useState<DefectRateData | null>(null)
  const [returnsAnalysis, setReturnsAnalysis] = useState<ReturnsAnalysisData | null>(null)
  const [loading, setLoading] = useState({
    defect: true,
    returns: true
  })

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading({
        defect: true,
        returns: true
      })
      
      try {
        // For this demo, we'll use mock data
        const defectData = api.mockApi.getDefectRate()
        const returnsData = api.mockApi.getReturnsAnalysis()
        
        setDefectRate(defectData)
        setReturnsAnalysis(returnsData)
      } catch (error) {
        console.error('Error fetching quality data:', error)
      } finally {
        // Add a small delay to simulate network request
        setTimeout(() => {
          setLoading({
            defect: false,
            returns: false
          })
        }, 800)
      }
    }
    
    fetchData()
  }, [activityCode, dateRange])

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Defect Rate */}
        <DataCard 
          title="Product Defect Rate" 
          loading={loading.defect}
          size="medium"
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle size={14} className="mr-1" />
              <span>Percentage of products identified as defective</span>
            </div>
          }
        >
          {defectRate && (
            <div className="flex flex-col space-y-4">
              <MetricDisplay
                value={formatPercent(defectRate.overallRate)}
                label="Overall Defect Rate"
              />
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Defect Rate by Category</h4>
                  <ChartContainer height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={defectRate.byCategory}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Defect Rate']} />
                        <Bar 
                          dataKey="rate" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                        >
                          {defectRate.byCategory.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.rate > 3 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Historical Trend</h4>
                  <ChartContainer height={150}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={defectRate.historical}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => value.split('-')[2]} // Just show the day
                        />
                        <YAxis domain={[0, 5]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Defect Rate']} />
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="hsl(var(--primary))" 
                          activeDot={{ r: 8 }}
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>
          )}
        </DataCard>

        {/* Returns Analysis */}
        <DataCard 
          title="Returns Analysis" 
          loading={loading.returns}
          size="medium"
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <RotateCw size={14} className="mr-1" />
              <span>Analysis of product returns and reasons</span>
            </div>
          }
        >
          {returnsAnalysis && (
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricDisplay
                  value={formatNumber(returnsAnalysis.totalReturns)}
                  label="Total Returns"
                />
                <MetricDisplay
                  value={formatPercent(returnsAnalysis.returnRate)}
                  label="Return Rate"
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Returns by Reason</h4>
                <ChartContainer height={200}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={returnsAnalysis.byReason}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="reason"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {returnsAnalysis.byReason.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [formatNumber(value), 'Returns']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Top Returned Products</h4>
                <div className="space-y-3">
                  {returnsAnalysis.byProduct.map(product => (
                    <div key={product.productId} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">{product.productName}</span>
                        <span className="text-sm font-medium">{formatPercent(product.returnRate)}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-primary" 
                          style={{ width: `${product.returnRate * 20}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatNumber(product.returnCount)} returns
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DataCard>
      </div>
    </div>
  )
}
