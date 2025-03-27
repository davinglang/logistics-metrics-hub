
import React, { useState } from 'react'
import { Header } from './Header'
import { cn } from '@/lib/utils'
import { ActivityCode } from '@/lib/api'
import { getDefaultDateRange } from '@/lib/utils'
import { 
  SidebarProvider, 
  SidebarInset,
} from '@/components/ui/sidebar'
import { DashboardSidebar } from './DashboardSidebar'

interface LayoutProps {
  children: React.ReactNode
}

export const DashboardContext = React.createContext<{
  activityCode: ActivityCode
  setActivityCode: (code: ActivityCode) => void
  dateRange: { startDate: string; endDate: string }
  setDateRange: (range: { startDate: string; endDate: string }) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeSection: string
  setActiveSection: (section: string) => void
}>({
  activityCode: 'ACT001',
  setActivityCode: () => {},
  dateRange: getDefaultDateRange(),
  setDateRange: () => {},
  sidebarOpen: true,
  setSidebarOpen: () => {},
  activeSection: 'dailyreports',
  setActiveSection: () => {},
})

export function Layout({ children }: LayoutProps) {
  const [activityCode, setActivityCode] = useState<ActivityCode>('ACT001')
  const [dateRange, setDateRange] = useState(getDefaultDateRange())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('dailyreports')

  return (
    <DashboardContext.Provider
      value={{
        activityCode,
        setActivityCode,
        dateRange,
        setDateRange,
        sidebarOpen,
        setSidebarOpen,
        activeSection,
        setActiveSection,
      }}
    >
      <SidebarProvider defaultOpen={sidebarOpen} open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="group/sidebar-wrapper flex min-h-screen h-screen w-full overflow-hidden bg-background">
          <DashboardSidebar />
          <SidebarInset>
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <div className="container mx-auto">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </DashboardContext.Provider>
  )
}
