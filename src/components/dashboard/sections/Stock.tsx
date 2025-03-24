
import React, { useContext, useEffect, useState } from 'react'
import { DashboardContext } from '../Layout'
import { DataCard } from '@/components/ui/data-card'
import { ChartContainer } from '@/components/ui/chart-container'
import { MetricDisplay } from '@/components/ui/metric-display'
import { 
  api, 
  InventoryDiscrepancyData, 
  StockRotationData, 
  OccupancyRateData
} from '@/lib/api'
import { formatNumber, formatPercent } from '@/lib/utils'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts'
import { ArrowUpDown, RotateCcw, Warehouse } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function StockSection() {
  const { activityCode, dateRange } = useContext(DashboardContext)

  // States for the metrics
  const [inventoryDiscrepancy, setInventoryDiscrepancy] = useState<InventoryDiscrepancyData | null>(null)
  const [stockRotation, setStockRotation] = useState<StockRotationData | null>(null)
  const [occupancyRate, setOccupancyRate] = useState<OccupancyRateData | null>(null)
  const [loading, setLoading] = useState({
    inventory: true,
    rotation: true,
    occupancy: true
  })

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading({
        inventory: true,
        rotation: true,
        occupancy: true
      })
      
      try {
        // For this demo, we'll use mock data
        const inventoryData = api.mockApi.getInventoryDiscrepancy()
        const rotationData = api.mockApi.getStockRotation()
        const occupancyData = api.mockApi.getOccupancyRate()
        
        setInventoryDiscrepancy(inventoryData)
        setStockRotation(rotationData)
        setOccupancyRate(occupancyData)
      } catch (error) {
        console.error('Error fetching stock data:', error)
      } finally {
        // Add a small delay to simulate network request
        setTimeout(() => {
          setLoading({
            inventory: false,
            rotation: false,
            occupancy: false
          })
        }, 800)
      }
    }
    
    fetchData()
  }, [activityCode, dateRange])

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

  // Function to determine color for occupancy rate
  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'hsl(var(--destructive))';
    if (rate >= 75) return 'hsl(var(--warning))';
    return 'hsl(var(--primary))';
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Inventory Discrepancy */}
        <DataCard 
          title="Inventory Discrepancy" 
          loading={loading.inventory}
          size="medium"
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpDown size={14} className="mr-1" />
              <span>Difference between expected and actual inventory</span>
            </div>
          }
        >
          {inventoryDiscrepancy && (
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricDisplay
                  value={formatNumber(inventoryDiscrepancy.totalDiscrepancy)}
                  label="Total Item Discrepancy"
                />
                <MetricDisplay
                  value={formatPercent(inventoryDiscrepancy.discrepancyRate)}
                  label="Discrepancy Rate"
                />
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Top Discrepancies by Product</h4>
                <div className="space-y-3">
                  {inventoryDiscrepancy.byProduct.slice(0, 5).map(product => (
                    <div key={product.productId} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">{product.productName}</span>
                        <span className="text-sm font-medium">{product.discrepancy < 0 ? "" : "+"}{product.discrepancy}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-muted-foreground">Expected: {product.expected}</div>
                        <div className="text-xs text-muted-foreground">Actual: {product.actual}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DataCard>

        {/* Stock Rotation */}
        <DataCard 
          title="Stock Rotation" 
          loading={loading.rotation}
          size="medium"
          footer={
            <div className="flex items-center text-xs text-muted-foreground">
              <RotateCcw size={14} className="mr-1" />
              <span>Average days in stock before shipping</span>
            </div>
          }
        >
          {stockRotation && (
            <div className="flex flex-col space-y-4">
              <MetricDisplay
                value={`${stockRotation.averageRotationDays} days`}
                label="Average Rotation Time"
              />
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Rotation by Category</h4>
                  <ChartContainer height={180}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stockRotation.byCategory}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="category" type="category" width={100} />
                        <Tooltip formatter={(value) => [`${value} days`, 'Rotation Time']} />
                        <Bar 
                          dataKey="rotationDays" 
                          fill="hsl(var(--primary))" 
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Slow Moving Products</h4>
                  <div className="space-y-2">
                    {stockRotation.slowMovingProducts.map(product => (
                      <div key={product.productId} className="flex justify-between items-center">
                        <span className="text-sm truncate" style={{maxWidth: '70%'}}>{product.productName}</span>
                        <span className="text-sm font-medium">{product.daysInStock} days</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DataCard>
      </div>

      {/* Warehouse Occupancy Rate */}
      <DataCard 
        title="Warehouse Occupancy Rate" 
        loading={loading.occupancy}
        size="large"
        footer={
          <div className="flex items-center text-xs text-muted-foreground">
            <Warehouse size={14} className="mr-1" />
            <span>Percentage of warehouse capacity currently in use</span>
          </div>
        }
      >
        {occupancyRate && (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <MetricDisplay
                value={formatPercent(occupancyRate.overallRate)}
                trend={occupancyRate.trend}
                label="Overall Occupancy Rate"
              />
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-success mr-2"></span>
                  <span className="text-sm">Under 75%</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-warning mr-2"></span>
                  <span className="text-sm">75-90%</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-destructive mr-2"></span>
                  <span className="text-sm">Over 90%</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-medium mb-4">Occupancy by Warehouse</h4>
                <ChartContainer height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={occupancyRate.byWarehouse}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="warehouseName" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Occupancy Rate']}
                      />
                      <Bar 
                        dataKey="occupancyRate" 
                        radius={[4, 4, 0, 0]}
                      >
                        {occupancyRate.byWarehouse.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getOccupancyColor(entry.occupancyRate)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-4">Warehouse Details</h4>
                <div className="space-y-4">
                  {occupancyRate.byWarehouse.map(warehouse => (
                    <div key={warehouse.warehouseId} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{warehouse.warehouseName}</span>
                        <span 
                          className="text-sm font-medium px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${getOccupancyColor(warehouse.occupancyRate)}20`,
                            color: getOccupancyColor(warehouse.occupancyRate)
                          }}
                        >
                          {formatPercent(warehouse.occupancyRate)}
                        </span>
                      </div>
                      
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${warehouse.occupancyRate}%`,
                            backgroundColor: getOccupancyColor(warehouse.occupancyRate)
                          }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Capacity: {formatNumber(warehouse.capacity)} units</div>
                        <div>Used: {formatNumber(warehouse.used)} units</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </DataCard>
    </div>
  )
}
