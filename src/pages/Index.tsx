
import React, { useContext } from 'react'
import { Layout, DashboardContext } from '@/components/dashboard/Layout'
import { ProductivitySection } from '@/components/dashboard/sections/Productivity'
import { FinancialSection } from '@/components/dashboard/sections/Financial'
import { AlertsSection } from '@/components/dashboard/sections/Alerts'
import { StockSection } from '@/components/dashboard/sections/Stock'
import { QualitySection } from '@/components/dashboard/sections/Quality'
import { DailyReportsSection } from '@/components/dashboard/sections/DailyReports'
import { ExportSection } from '@/components/dashboard/sections/Export'

const Index = () => {
  return (
    <Layout>
      <DashboardContent />
    </Layout>
  )
}

const DashboardContent = () => {
  const { activeSection } = useContext(DashboardContext)

  // Afficher la section active en fonction de la sélection dans la barre latérale
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dailyreports':
        return <DailyReportsSection />
      case 'productivity':
        return <ProductivitySection />
      case 'financial':
        return <FinancialSection />
      case 'alerts':
        return <AlertsSection />
      case 'stock':
        return <StockSection />
      case 'quality':
        return <QualitySection />
      case 'export':
        return <ExportSection />
      default:
        return <DailyReportsSection />
    }
  }

  return (
    <div className="animate-fade-in">
      {renderActiveSection()}
    </div>
  )
}

export default Index
