import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | ApplyMint AI',
  description: 'Your AI-powered job search dashboard.',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your AI-powered job search dashboard.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Jobs Applied</h3>
              <p className="text-2xl font-bold text-primary mt-2">24</p>
              <p className="text-xs text-chart-2 mt-1">+3 this week</p>
            </div>
            
            <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Interviews</h3>
              <p className="text-2xl font-bold text-primary mt-2">5</p>
              <p className="text-xs text-chart-2 mt-1">+2 scheduled</p>
            </div>
            
            <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Match Score</h3>
              <p className="text-2xl font-bold text-primary mt-2">94%</p>
              <p className="text-xs text-chart-4 mt-1">Above average</p>
            </div>
            
            <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Response Rate</h3>
              <p className="text-2xl font-bold text-primary mt-2">68%</p>
              <p className="text-xs text-chart-2 mt-1">+12% from last month</p>
            </div>
          </div>
          
          <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                <p className="text-sm">Applied to Software Engineer at TechCorp</p>
                <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                <p className="text-sm">Interview scheduled with DataFlow Inc.</p>
                <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                <p className="text-sm">Profile viewed by AI Solutions</p>
                <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}