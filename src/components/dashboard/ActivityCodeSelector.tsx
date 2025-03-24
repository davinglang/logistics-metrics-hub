
import React, { useContext, useState } from 'react'
import { DashboardContext } from './Layout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ActivityCodeSelector() {
  const { activityCode, setActivityCode } = useContext(DashboardContext)
  
  // Sample activity codes
  const activityCodes = [
    { value: 'ACT001', label: 'ACT001 - Main Warehouse' },
    { value: 'ACT002', label: 'ACT002 - East Distribution' },
    { value: 'ACT003', label: 'ACT003 - West Distribution' },
    { value: 'ACT004', label: 'ACT004 - North Center' },
    { value: 'ACT005', label: 'ACT005 - South Center' },
  ]

  return (
    <div className="flex items-center">
      <Select
        value={activityCode}
        onValueChange={setActivityCode}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select activity code" />
        </SelectTrigger>
        <SelectContent>
          {activityCodes.map((code) => (
            <SelectItem key={code.value} value={code.value}>
              {code.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
