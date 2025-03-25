
import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'
import { ActivityCode } from '@/lib/api'
import { getDefaultDateRange } from '@/lib/utils'

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
      <div className="h-screen flex overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main 
            className={cn(
              "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
              sidebarOpen ? "pl-64" : "pl-0"
            )}
          >
            <div className="container mx-auto py-6 px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  )
}
