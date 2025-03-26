
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Download, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export function ExportSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedData, setSelectedData] = useState({
    dailyReports: true,
    productivity: false,
    financial: false,
    alerts: false,
    stock: false,
    quality: false,
  })

  const handleCheckboxChange = (id: keyof typeof selectedData) => {
    setSelectedData(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleExport = () => {
    // Dans une application réelle, cela déclencherait le processus d'exportation
    console.log('Exportation des données:', {
      date: selectedDate,
      selectedData
    })
    
    // Message de succès simulé
    alert('Les données ont été exportées avec succès!')
  }

  const exportItems = [
    { id: 'dailyReports', label: 'Rapports Journaliers' },
    { id: 'productivity', label: 'Métriques de Productivité' },
    { id: 'financial', label: 'Métriques Financières' },
    { id: 'alerts', label: 'Alertes du Système' },
    { id: 'stock', label: 'Données de Stock et Stockage' },
    { id: 'quality', label: 'Données d\'Assurance Qualité' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Exporter les Données</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sélection des Données à Exporter</CardTitle>
          <CardDescription>
            Choisissez les données que vous souhaitez exporter et la date spécifique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Sélectionnez une Date</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : <span>Sélectionnez une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    locale={fr}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Sélectionnez les Données</h3>
              <div className="space-y-4">
                {exportItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={item.id}
                      checked={selectedData[item.id as keyof typeof selectedData]}
                      onCheckedChange={() => handleCheckboxChange(item.id as keyof typeof selectedData)}
                    />
                    <label
                      htmlFor={item.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="mt-6" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter les Données
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
