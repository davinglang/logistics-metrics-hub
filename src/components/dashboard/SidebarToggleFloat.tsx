
import React, { useContext } from 'react'
import { DashboardContext } from './Layout'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function SidebarToggleFloat() {
  const { sidebarOpen, setSidebarOpen } = useContext(DashboardContext)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Button
      variant="default"
      size="icon"
      onClick={toggleSidebar}
      className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg md:hidden"
      aria-label="Afficher/Masquer le menu latéral"
    >
      <Menu size={20} />
    </Button>
  )
}
