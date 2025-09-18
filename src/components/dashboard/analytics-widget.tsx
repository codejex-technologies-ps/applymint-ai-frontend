import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
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
  LineChart,
  Line,
} from 'recharts'
import {
  TrendingUp,
  Target,
  DollarSign,
} from 'lucide-react'

// Sample data for charts
const applicationData = [
  { month: 'Jan', applications: 12, interviews: 3, offers: 1 },
  { month: 'Feb', applications: 18, interviews: 5, offers: 2 },
  { month: 'Mar', applications: 24, interviews: 8, offers: 3 },
  { month: 'Apr', applications: 15, interviews: 4, offers: 1 },
  { month: 'May', applications: 22, interviews: 6, offers: 2 },
  { month: 'Jun', applications: 28, interviews: 9, offers: 4 },
]

const responseData = [
  { name: 'Applied', value: 120, color: 'var(--chart-1)' },
  { name: 'Responded', value: 45, color: 'var(--chart-2)' },
  { name: 'Interviewed', value: 18, color: 'var(--chart-3)' },
  { name: 'Offers', value: 8, color: 'var(--chart-4)' },
]

const salaryData = [
  { range: '60-80k', count: 15 },
  { range: '80-100k', count: 35 },
  { range: '100-120k', count: 42 },
  { range: '120-140k', count: 28 },
  { range: '140k+', count: 12 },
]

export interface AnalyticsWidgetProps {
  loading?: boolean
  className?: string
}

export const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({
  loading = false,
  className,
}) => {
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-card text-card-foreground border border-border">
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Application Trends */}
      <Card className="bg-card text-card-foreground border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Application Trends</span>
          </CardTitle>
          <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">
            6 Months
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="applications" fill="var(--chart-1)" name="Applications" radius={[2, 2, 0, 0]} />
                <Bar dataKey="interviews" fill="var(--chart-2)" name="Interviews" radius={[2, 2, 0, 0]} />
                <Bar dataKey="offers" fill="var(--chart-3)" name="Offers" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Response Funnel */}
      <Card className="bg-card text-card-foreground border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Application Funnel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={responseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {responseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {responseData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {((item.value / responseData[0].value) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Distribution */}
      <Card className="bg-card text-card-foreground border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Salary Range Distribution</span>
          </CardTitle>
          <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
            Applied Jobs
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="range" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--chart-2)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--chart-2)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--chart-2)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">$95k</div>
                <div className="text-xs text-muted-foreground">Average</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">$120k</div>
                <div className="text-xs text-muted-foreground">Target</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">$75k</div>
                <div className="text-xs text-muted-foreground">Minimum</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">$160k</div>
                <div className="text-xs text-muted-foreground">Maximum</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}