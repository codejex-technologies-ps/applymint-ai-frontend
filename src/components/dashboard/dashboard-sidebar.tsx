import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Search,
  Briefcase,
  User,
  BarChart3,
  Settings,
  BookOpen,
  Star,
  Calendar,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brain,
  Mic,
  MessageSquare,
} from 'lucide-react'

export interface SidebarItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: SidebarItem[]
}

export interface DashboardSidebarProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'jobs',
    label: 'Jobs',
    href: '/dashboard/jobs',
    icon: Search,
    children: [
      {
        id: 'search',
        label: 'Search',
        href: '/dashboard/jobs/search',
        icon: Search,
      },
      {
        id: 'recommended',
        label: 'Recommended',
        href: '/dashboard/jobs/recommended',
        icon: Star,
        badge: 'AI',
      },
      {
        id: 'applied',
        label: 'Applied',
        href: '/dashboard/jobs/applied',
        icon: Briefcase,
      },
      {
        id: 'saved',
        label: 'Saved',
        href: '/dashboard/jobs/saved',
        icon: Star,
      },
    ],
  },
  {
    id: 'applications',
    label: 'Applications',
    href: '/dashboard/applications',
    icon: Briefcase,
  },
  {
    id: 'interviews',
    label: 'Interviews',
    href: '/dashboard/interviews',
    icon: Calendar,
  },
  {
    id: 'interview-simulator',
    label: 'AI Interview',
    href: '/interview',
    icon: Brain,
    badge: 'AI',
    children: [
      {
        id: 'interview-start',
        label: 'Start Interview',
        href: '/interview',
        icon: Sparkles,
      },
      {
        id: 'interview-text',
        label: 'Text Practice',
        href: '/interview?mode=text',
        icon: MessageSquare,
      },
      {
        id: 'interview-voice',
        label: 'Voice Practice',
        href: '/interview?mode=voice',
        icon: Mic,
      },
    ],
  },
  {
    id: 'interview-prep',
    label: 'Interview Prep',
    href: '/dashboard/interview-prep',
    icon: BookOpen,
    badge: 'AI',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  className,
}) => {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const isParentActive = (item: SidebarItem) => {
    if (isActive(item.href)) return true
    return item.children?.some(child => isActive(child.href)) || false
  }

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-chart-1 to-chart-2 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-sidebar-foreground">
                  ApplyMint AI
                </h2>
                <p className="text-xs text-sidebar-foreground/70">
                  Dashboard
                </p>
              </div>
            </div>
          )}
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const active = isParentActive(item)
          
          return (
            <div key={item.id}>
              <Link href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors group",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge className="px-1.5 py-0.5 text-xs bg-accent text-accent-foreground">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </Link>

              {/* Children - only show if not collapsed and has children */}
              {!collapsed && item.children && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    const childActive = isActive(child.href)
                    
                    return (
                      <Link key={child.id} href={child.href}>
                        <div
                          className={cn(
                            "flex items-center space-x-3 px-3 py-1.5 rounded-md transition-colors text-sm",
                            childActive
                              ? "bg-sidebar-primary/50 text-sidebar-primary-foreground"
                              : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                          )}
                        >
                          <ChildIcon className="h-3 w-3 flex-shrink-0" />
                          <span className="flex-1">{child.label}</span>
                          {child.badge && (
                            <Badge className="px-1 py-0 text-xs bg-accent text-accent-foreground">
                              {child.badge}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-sidebar-foreground/70">
              <Bell className="h-3 w-3" />
              <span>3 new notifications</span>
            </div>
            
            <Separator className="bg-sidebar-border" />
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}

        {collapsed && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}