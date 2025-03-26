
import React, { useContext } from 'react'
import { DashboardContext } from './Layout'
import { ActivityCodeSelector } from './ActivityCodeSelector'
import { DateRangePicker } from './DateRangePicker'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Menu, RefreshCw } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { UserMenu } from './UserMenu'

export function Header() {
  const { activeSection, sidebarOpen, setSidebarOpen } = useContext(DashboardContext)

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dailyreports':
        return 'Rapports Journaliers'
      case 'productivity':
        return 'Métriques de Productivité'
      case 'financial':
        return 'Métriques Financières'
      case 'alerts':
        return 'État des Alertes Système'
      case 'stock':
        return 'Métriques de Stock et Stockage'
      case 'quality':
        return 'Assurance Qualité'
      case 'export':
        return 'Exporter les Données'
      default:
        return 'Tableau de Bord'
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <header className="z-10 bg-card/80 backdrop-blur-md border-b border-border sticky top-0">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">{getSectionTitle()}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <ActivityCodeSelector />
          <Separator orientation="vertical" className="h-8" />
          <DateRangePicker />
          <Button variant="outline" size="icon" title="Actualiser">
            <RefreshCw size={16} />
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
