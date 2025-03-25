
import React, { useContext } from 'react'
import { DashboardContext } from '../Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { ChartContainer } from '@/components/ui/chart-container'
import { 
  Package, 
  TruckIcon, 
  ShoppingBag,
  ArrowUpDown
} from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function DailyReportsSection() {
  const { activityCode, dateRange } = useContext(DashboardContext)

  // Mock data - in a real app this would come from API calls
  const stockData = [
    { location: "Warehouse A", total_stock: 500, date: "2023-10-01" },
    { location: "Warehouse B", total_stock: 300, date: "2023-10-01" },
    { location: "Warehouse C", total_stock: 450, date: "2023-10-01" },
    { location: "Warehouse D", total_stock: 720, date: "2023-10-01" }
  ]

  const ordersData = [
    { date: "2023-10-01", received: 280, shipped: 250 },
    { date: "2023-10-02", received: 300, shipped: 270 },
    { date: "2023-10-03", received: 350, shipped: 310 },
    { date: "2023-10-04", received: 320, shipped: 290 },
    { date: "2023-10-05", received: 390, shipped: 350 },
    { date: "2023-10-06", received: 400, shipped: 380 },
    { date: "2023-10-07", received: 380, shipped: 360 },
  ]

  const transporterData = [
    { transporter: "Truck A", deliveries_completed: 50, date: "2023-10-01" },
    { transporter: "Truck B", deliveries_completed: 30, date: "2023-10-01" },
    { transporter: "Truck C", deliveries_completed: 45, date: "2023-10-01" },
    { transporter: "Truck D", deliveries_completed: 25, date: "2023-10-01" },
    { transporter: "Truck E", deliveries_completed: 60, date: "2023-10-01" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-1">
      {/* Orders Report Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>
              <div className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Orders Summary
              </div>
            </CardTitle>
            <CardDescription>
              Overview of orders for {activityCode} from {dateRange.startDate} to {dateRange.endDate}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={ordersData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="received" 
                  name="Orders Received" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                />
                <Area 
                  type="monotone" 
                  dataKey="shipped" 
                  name="Orders Shipped" 
                  stackId="2" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Orders Received
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">280</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Orders Shipped
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,381</div>
                <p className="text-xs text-muted-foreground">
                  +4% from last period
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Stock Report Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>
              <div className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Stock Summary
              </div>
            </CardTitle>
            <CardDescription>
              Stock levels across locations for {activityCode}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_stock" name="Total Stock" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stock Summary by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Total Stock</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.total_stock}</TableCell>
                      <TableCell>{item.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      
      {/* Transporter Report Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>
              <div className="flex items-center">
                <TruckIcon className="mr-2 h-5 w-5" />
                Transporter Summary
              </div>
            </CardTitle>
            <CardDescription>
              Deliveries completed by transporters
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={transporterData}
                margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="transporter" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="deliveries_completed" name="Deliveries Completed" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transporter Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transporter</TableHead>
                    <TableHead>Deliveries Completed</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transporterData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.transporter}</TableCell>
                      <TableCell>{item.deliveries_completed}</TableCell>
                      <TableCell>{item.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
