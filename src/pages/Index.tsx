
import React, { useContext, useState } from 'react'
import { Layout, DashboardContext } from '@/components/dashboard/Layout'
import { ProductivitySection } from '@/components/dashboard/sections/Productivity'
import { FinancialSection } from '@/components/dashboard/sections/Financial'
import { AlertsSection } from '@/components/dashboard/sections/Alerts'
import { StockSection } from '@/components/dashboard/sections/Stock'
import { QualitySection } from '@/components/dashboard/sections/Quality'

const Index = () => {
  return (
    <Layout>
      <DashboardContent />
    </Layout>
  )
}

const DashboardContent = () => {
  const { activeSection } = useContext(DashboardContext)

  // Render the active section based on the sidebar selection
  const renderActiveSection = () => {
    switch (activeSection) {
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
      default:
        return <ProductivitySection />
    }
  }

  return (
    <div className="animate-fade-in">
      {renderActiveSection()}
    </div>
  )
}

export default Index
