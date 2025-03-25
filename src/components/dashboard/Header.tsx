
import React, { useContext } from 'react'
import { DashboardContext } from './Layout'
import { SidebarToggle } from './Sidebar'
import { ActivityCodeSelector } from './ActivityCodeSelector'
import { DateRangePicker } from './DateRangePicker'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { UserMenu } from './UserMenu'

export function Header() {
  const { activeSection } = useContext(DashboardContext)

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dailyreports':
        return 'Rapports Journaliers'
      case 'productivity':
        return 'Productivity Metrics'
      case 'financial':
        return 'Financial Metrics'
      case 'alerts':
        return 'System Alerts'
      case 'stock':
        return 'Stock & Storage Metrics'
      case 'quality':
        return 'Quality Assurance'
      default:
        return 'Dashboard'
    }
  }

  return (
    <header className="z-10 bg-card/80 backdrop-blur-md border-b border-border sticky top-0">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <SidebarToggle />
          <h1 className="text-xl font-semibold tracking-tight">{getSectionTitle()}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <ActivityCodeSelector />
          <Separator orientation="vertical" className="h-8" />
          <DateRangePicker />
          <Button variant="outline" size="icon">
            <RefreshCw size={16} />
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
