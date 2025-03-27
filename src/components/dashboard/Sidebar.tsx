
import React, { useContext } from 'react'
import { cn } from '@/lib/utils'
import { DashboardContext } from './Layout'
import { 
  BarChart3, 
  TrendingUp,
  Bell,
  PackageSearch,
  CircleCheck,
  Menu,
  X,
  FileText,
  Download,
  ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function Sidebar() {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    activeSection, 
    setActiveSection 
  } = useContext(DashboardContext)
  
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
    // Toujours naviguer vers la page du tableau de bord lors du clic sur une section
    navigate('/')
  }

  const handleLogoClick = () => {
    setActiveSection('dailyreports')
    navigate('/')
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex-shrink-0 w-64 transform transition-transform duration-300 ease-in-out bg-card border-r border-border overflow-hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={handleLogoClick}
          >
            <span className="text-lg font-semibold tracking-tight">Hub de Logistique</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    "flex items-center w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="mr-3">{section.icon}</span>
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-between"
            aria-label="Réduire le menu latéral"
          >
            <ChevronLeft size={18} />
            <span className="text-xs font-medium">Réduire le menu</span>
          </Button>
        </div>

        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          Hub de Logistique API v1.0
        </div>
      </div>
    </aside>
  )
}

export function SidebarToggle() {
  const { sidebarOpen, setSidebarOpen } = useContext(DashboardContext)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="mr-2"
      aria-label="Afficher/Masquer le menu latéral"
    >
      <Menu size={20} />
    </Button>
  )
}
