
import React, { useContext } from 'react'
import { DashboardContext } from '../Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'
import { ChartContainer } from '@/components/ui/chart-container'
import { CheckCircle, AlertTriangle, Bug, Award, ClipboardCheck } from 'lucide-react'

export function QualitySection() {
  const { activityCode, dateRange } = useContext(DashboardContext)

  // Mock data for defect rates over time
  const defectRateData = [
    { month: 'Jan', rate: 3.2 },
    { month: 'Feb', rate: 3.8 },
    { month: 'Mar', rate: 2.9 },
    { month: 'Apr', rate: 3.3 },
    { month: 'May', rate: 2.5 },
    { month: 'Jun', rate: 2.0 },
    { month: 'Jul', rate: 1.8 },
    { month: 'Aug', rate: 1.5 },
    { month: 'Sep', rate: 1.2 },
    { month: 'Oct', rate: 1.0 },
  ]

  // Mock data for defect types
  const defectTypesData = [
    { type: 'Packaging', count: 28 },
    { type: 'Labeling', count: 21 },
    { type: 'Damage', count: 17 },
    { type: 'Missing Items', count: 12 },
    { type: 'Wrong Product', count: 9 },
  ]

  // Mock data for quality audit scores
  const auditScoresData = [
    { date: '2023-10-01', score: 92 },
    { date: '2023-10-08', score: 94 },
    { date: '2023-10-15', score: 91 },
    { date: '2023-10-22', score: 95 },
    { date: '2023-10-29', score: 96 },
    { date: '2023-11-05', score: 97 },
  ]

  // Mock data for compliance rates
  const complianceData = [
    { name: 'Packaging Standards', value: 95 },
    { name: 'Safety Regulations', value: 98 },
    { name: 'Documentation', value: 92 },
    { name: 'Storage Conditions', value: 96 },
    { name: 'Handling Procedures', value: 94 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Quality Overview</CardTitle>
            <CardDescription>
              Quality metrics for {activityCode} from {dateRange.startDate} to {dateRange.endDate}
            </CardDescription>
          </div>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium">Defect Rate</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold">1.2%</div>
                <p className="text-xs text-muted-foreground">-0.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold">96/100</div>
                <p className="text-xs text-muted-foreground">+2 points from last audit</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium">Customer Returns</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold">0.8%</div>
                <p className="text-xs text-muted-foreground">-0.2% from last quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold">95%</div>
                <p className="text-xs text-muted-foreground">+1% from last audit</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Defect Rate Trend</CardTitle>
            <CardDescription>Monthly defect rate over time</CardDescription>
          </div>
          <Bug className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <ChartContainer height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defectRateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" name="Defect Rate (%)" stroke="#f43f5e" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Defects by Type</CardTitle>
            <CardDescription>Distribution of quality issues</CardDescription>
          </div>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <ChartContainer height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectTypesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Number of Defects" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Quality Audit Scores</CardTitle>
            <CardDescription>Weekly quality assessment results</CardDescription>
          </div>
          <Award className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <ChartContainer height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={auditScoresData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[85, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" name="Audit Score" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Compliance Breakdown</CardTitle>
            <CardDescription>Compliance rates by category</CardDescription>
          </div>
          <ClipboardCheck className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <ChartContainer height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
