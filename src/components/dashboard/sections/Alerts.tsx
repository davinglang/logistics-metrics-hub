
import React, { useContext, useEffect, useState } from 'react'
import { DashboardContext } from '../Layout'
import { DataCard } from '@/components/ui/data-card'
import { MetricDisplay } from '@/components/ui/metric-display'
import { getSeverityColor } from '@/lib/utils'
import { 
  api, 
  UnderProductivityAlertData, 
  LowRevenueAlertData, 
  StorageThresholdAlertData, 
  DefectRateAlertData 
} from '@/lib/api'
import { 
  AlertCircle, 
  Bell, 
  CheckCircle, 
  Zap, 
  Users, 
  TrendingDown, 
  Package, 
  AlertTriangle 
} from 'lucide-react'
import { formatPercent } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Reusable alert card component
function AlertCard({ 
  title, 
  icon, 
  triggered, 
  threshold, 
  currentValue, 
  details, 
  since,
  loading,
  formatValue = (val: number) => val.toString(),
  formatThreshold = (val: number) => val.toString()
}: { 
  title: string
  icon: React.ReactNode
  triggered: boolean
  threshold: number
  currentValue: number
  details?: React.ReactNode
  since?: string
  loading: boolean
  formatValue?: (val: number) => string
  formatThreshold?: (val: number) => string
}) {
  const severity = 
    triggered && Math.abs(currentValue - threshold) / threshold > 0.2 ? 'critical' :
    triggered ? 'high' : 'low'
  
  const severityColor = getSeverityColor(severity)
  const formattedCurrent = formatValue(currentValue)
  const formattedThreshold = formatThreshold(threshold)

  return (
    <DataCard 
      title={title} 
      loading={loading}
    >
      {!loading && (
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${severityColor}`}>
                {icon}
              </div>
              <div>
                <h3 className="font-medium">
                  {triggered ? 'Alert Triggered' : 'No Alert'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Threshold: {formattedThreshold}
                </p>
              </div>
            </div>
            
            {triggered && (
              <Badge variant="outline" className="bg-muted/50">
                Since {since}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Current Value:</p>
            <div className="text-2xl font-semibold">
              {formattedCurrent}
            </div>
          </div>

          {details && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium">Details:</p>
                {details}
              </div>
            </>
          )}
        </div>
      )}
    </DataCard>
  )
}

export function AlertsSection() {
  const { activityCode, dateRange } = useContext(DashboardContext)

  // States for the alerts
  const [productivityAlert, setProductivityAlert] = useState<UnderProductivityAlertData | null>(null)
  const [revenueAlert, setRevenueAlert] = useState<LowRevenueAlertData | null>(null)
  const [storageAlert, setStorageAlert] = useState<StorageThresholdAlertData | null>(null)
  const [defectAlert, setDefectAlert] = useState<DefectRateAlertData | null>(null)
  const [loading, setLoading] = useState({
    productivity: true,
    revenue: true,
    storage: true,
    defect: true
  })

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading({
        productivity: true,
        revenue: true,
        storage: true,
        defect: true
      })
      
      try {
        // For this demo, we'll use mock data
        const productivityData = api.mockApi.getUnderProductivityAlert()
        const revenueData = api.mockApi.getLowRevenueAlert()
        const storageData = api.mockApi.getStorageThresholdAlert()
        const defectData = api.mockApi.getDefectRateAlert()
        
        setProductivityAlert(productivityData)
        setRevenueAlert(revenueData)
        setStorageAlert(storageData)
        setDefectAlert(defectData)
      } catch (error) {
        console.error('Error fetching alert data:', error)
      } finally {
        // Add a small delay to simulate network request
        setTimeout(() => {
          setLoading({
            productivity: false,
            revenue: false,
            storage: false,
            defect: false
          })
        }, 800)
      }
    }
    
    fetchData()
  }, [activityCode, dateRange])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">System Alerts Status</h2>
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-xs">
            <span className="w-2 h-2 rounded-full bg-success mr-1"></span>
            No Alerts
          </span>
          <span className="flex items-center text-xs">
            <span className="w-2 h-2 rounded-full bg-warning mr-1"></span>
            Warning
          </span>
          <span className="flex items-center text-xs">
            <span className="w-2 h-2 rounded-full bg-destructive mr-1"></span>
            Critical
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Under Productivity Alert */}
        {productivityAlert && (
          <AlertCard
            title="Under Productivity Alert"
            icon={<Users size={16} className="text-white" />}
            triggered={productivityAlert.triggered}
            threshold={productivityAlert.threshold}
            currentValue={productivityAlert.currentValue}
            details={
              productivityAlert.triggered && (
                <div className="text-sm space-y-1">
                  <p>Affected Teams:</p>
                  <div className="flex flex-wrap gap-1">
                    {productivityAlert.affectedTeams.map(team => (
                      <Badge key={team} variant="outline">
                        {team}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            }
            since={productivityAlert.since}
            loading={loading.productivity}
            formatValue={(val) => `${val} pieces/worker`}
            formatThreshold={(val) => `${val} pieces/worker`}
          />
        )}

        {/* Low Revenue Alert */}
        {revenueAlert && (
          <AlertCard
            title="Low Revenue Alert"
            icon={<TrendingDown size={16} className="text-white" />}
            triggered={revenueAlert.triggered}
            threshold={revenueAlert.threshold}
            currentValue={revenueAlert.currentValue}
            details={
              revenueAlert.triggered && (
                <div className="text-sm">
                  <p>Revenue is {formatPercent(revenueAlert.percentageBelowThreshold)} below threshold</p>
                </div>
              )
            }
            since={revenueAlert.since}
            loading={loading.revenue}
            formatValue={(val) => `$${val}`}
            formatThreshold={(val) => `$${val}`}
          />
        )}

        {/* Storage Threshold Alert */}
        {storageAlert && (
          <AlertCard
            title="Storage Occupancy Alert"
            icon={<Package size={16} className="text-white" />}
            triggered={storageAlert.triggered}
            threshold={storageAlert.threshold}
            currentValue={storageAlert.currentOccupancy}
            details={
              storageAlert.triggered && (
                <div className="text-sm space-y-2">
                  <p>Affected Warehouses:</p>
                  <div className="space-y-2">
                    {storageAlert.affectedWarehouses.map(warehouse => (
                      <div key={warehouse.id} className="flex justify-between items-center text-xs">
                        <span>{warehouse.name}</span>
                        <span className="font-medium">{formatPercent(warehouse.occupancy)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            loading={loading.storage}
            formatValue={(val) => `${val}% occupied`}
            formatThreshold={(val) => `${val}%`}
          />
        )}

        {/* Defect Rate Alert */}
        {defectAlert && (
          <AlertCard
            title="Defect Rate Alert"
            icon={<AlertTriangle size={16} className="text-white" />}
            triggered={defectAlert.triggered}
            threshold={defectAlert.threshold}
            currentValue={defectAlert.currentRate}
            details={
              defectAlert.triggered && (
                <div className="text-sm space-y-1">
                  <p>Affected Products:</p>
                  <div className="flex flex-wrap gap-1">
                    {defectAlert.affectedProducts.map(product => (
                      <Badge key={product} variant="outline">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            }
            since={defectAlert.since}
            loading={loading.defect}
            formatValue={(val) => `${val}% defect rate`}
            formatThreshold={(val) => `${val}%`}
          />
        )}
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-medium mb-2 flex items-center">
          <Bell size={16} className="mr-2" />
          Alert Summary
        </h3>
        <p className="text-sm text-muted-foreground">
          {(() => {
            const triggeredCount = [
              productivityAlert?.triggered,
              revenueAlert?.triggered,
              storageAlert?.triggered,
              defectAlert?.triggered
            ].filter(Boolean).length;
            
            if (triggeredCount === 0) {
              return 'All systems operating within normal parameters. No alerts triggered.';
            } else {
              return `${triggeredCount} active alert${triggeredCount > 1 ? 's' : ''} requiring attention. Check the dashboard for details.`;
            }
          })()}
        </p>
      </div>
    </div>
  )
}
