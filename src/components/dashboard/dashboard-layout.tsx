'use client'

import React, { useState } from 'react'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardHeader } from './dashboard-header'
import { cn } from '@/lib/utils'

export interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        className="hidden lg:flex"
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          onMenuClick={toggleSidebar}
          showMenuButton={true}
        />

        {/* Page content */}
        <main className={cn("flex-1 overflow-auto", className)}>
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {!sidebarCollapsed && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <DashboardSidebar
            collapsed={false}
            onToggleCollapse={toggleSidebar}
            className="absolute left-0 top-0 h-full shadow-lg"
          />
        </div>
      )}
    </div>
  )
}