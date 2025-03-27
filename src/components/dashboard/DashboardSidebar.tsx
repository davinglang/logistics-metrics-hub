
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardContext } from './Layout'
import { 
  BarChart3, 
  TrendingUp,
  Bell,
  PackageSearch,
  CircleCheck,
  FileText,
  Download,
  ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar'

export function DashboardSidebar() {
  const { activeSection, setActiveSection } = useContext(DashboardContext)
  const { state } = useSidebar()
  const navigate = useNavigate()
  
  const sections = [
    {
      id: 'dailyreports',
      label: 'Rapports Journaliers',
      icon: <FileText size={18} />,
    },
    {
      id: 'productivity',
      label: 'Productivité',
      icon: <BarChart3 size={18} />,
    },
    {
      id: 'financial',
      label: 'Financier',
      icon: <TrendingUp size={18} />,
    },
    {
      id: 'alerts',
      label: 'Alertes',
      icon: <Bell size={18} />,
    },
    {
      id: 'stock',
      label: 'Stock & Stockage',
      icon: <PackageSearch size={18} />,
    },
    {
      id: 'quality',
      label: 'Assurance Qualité',
      icon: <CircleCheck size={18} />,
    },
    {
      id: 'export',
      label: 'Exporter les Données',
      icon: <Download size={18} />,
    },
  ]

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
    navigate('/')
  }

  const handleLogoClick = () => {
    setActiveSection('dailyreports')
    navigate('/')
  }
  
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r border-border">
      <SidebarRail />
      <SidebarHeader className="border-b border-border px-3 py-3">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
          >
            {state === "expanded" ? (
              <span className="text-lg font-semibold tracking-tight">Hub de Logistique</span>
            ) : (
              <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary/10 text-primary">
                HL
              </div>
            )}
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {sections.map((section) => (
            <SidebarMenuItem key={section.id}>
              <SidebarMenuButton
                isActive={activeSection === section.id}
                onClick={() => handleSectionClick(section.id)}
                tooltip={section.label}
              >
                {section.icon}
                <span>{section.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border px-3 py-2 text-xs text-muted-foreground text-center">
        {state === "expanded" ? "Hub de Logistique API v1.0" : "v1.0"}
      </SidebarFooter>
    </Sidebar>
  )
}
