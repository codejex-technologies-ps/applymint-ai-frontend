import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/components/auth/auth-provider'
import { ModeToggle } from '@/components/ui/mode-toggle'
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Menu,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

export interface DashboardHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
  className?: string
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuClick,
  showMenuButton = false,
  className,
}) => {
  const { user, signOut } = useAuth()

  const getInitials = (email: string) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return email.charAt(0).toUpperCase()
  }

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.firstName) {
      return user.firstName
    }
    return user?.email || 'User'
  }

  return (
    <header className={`bg-background border-b border-border ${className}`}>
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Search */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies..."
                className="pl-10 w-80 bg-background border-input focus:border-ring"
              />
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Mobile search button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground flex items-center justify-center">
                3
              </Badge>
            </Button>
          </div>

          {/* Theme toggle */}
          <ModeToggle />

          {/* Help */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help">
              <HelpCircle className="h-5 w-5" />
            </Link>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={getDisplayName()} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email ? getInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  {user?.isEmailVerified && (
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="h-2 w-2 bg-chart-2 rounded-full"></div>
                      <span className="text-xs text-chart-2">Verified</span>
                    </div>
                  )}
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/help" className="flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies..."
            className="pl-10 bg-background border-input focus:border-ring"
          />
        </div>
      </div>

      {/* Quick stats bar (optional) */}
      <div className="hidden lg:flex items-center justify-center py-2 bg-muted/20 border-t border-border">
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-chart-1" />
            <span className="text-muted-foreground">AI Match Score:</span>
            <span className="font-medium text-foreground">94%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Active Applications:</span>
            <span className="font-medium text-foreground">24</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Interview Response Rate:</span>
            <span className="font-medium text-chart-2">68%</span>
          </div>
        </div>
      </div>
    </header>
  )
}