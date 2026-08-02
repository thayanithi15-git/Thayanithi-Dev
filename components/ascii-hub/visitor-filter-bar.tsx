"use client"

import * as React from "react"
import { Search, MapPin, Smartphone, Calendar as CalendarIcon, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface VisitorFilterBarProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  selectedLocation: string
  setSelectedLocation: (val: string) => void
  selectedDevice: string
  setSelectedDevice: (val: string) => void
  startDate: string
  setStartDate: (val: string) => void
  endDate: string
  setEndDate: (val: string) => void
  onReset: () => void
  locations: string[]
}

// Custom Date Picker component with Radix Popover and theme-styled Calendar
function CustomDatePicker({
  label,
  value,
  onChange,
  iconColorClass = "text-amber-500"
}: {
  label: string
  value: string
  onChange: (val: string) => void
  iconColorClass?: string
}) {
  const [open, setOpen] = React.useState(false)

  // Convert YYYY-MM-DD to DD-MM-YYYY or formatted display string
  const formattedDisplay = React.useMemo(() => {
    if (!value) return "dd-mm-yyyy"
    const parts = value.split("-")
    if (parts.length === 3) {
      const [y, m, d] = parts
      return `${d}-${m}-${y}`
    }
    return value
  }, [value])

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    const parts = value.split("-")
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
    }
    return undefined
  }, [value])

  const handleSelectDate = (date?: Date) => {
    if (date) {
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, "0")
      const dd = String(date.getDate()).padStart(2, "0")
      onChange(`${yyyy}-${mm}-${dd}`)
      setOpen(false)
    } else {
      onChange("")
    }
  }

  return (
    <div className="space-y-1.5 min-w-0">
      <label className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 font-bold">
        <CalendarIcon size={12} className={iconColorClass} /> {label}
      </label>
      <div className="relative flex items-center w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-full h-9 bg-background/80 border border-border hover:border-foreground/50 rounded px-3 text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            >
              <span className={value ? "text-foreground font-bold" : "text-muted-foreground/60"}>
                {formattedDisplay}
              </span>
              <CalendarIcon size={13} className={`${iconColorClass} opacity-80 flex-shrink-0`} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-background border border-border text-foreground font-mono shadow-2xl rounded-md" align="start">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border text-[11px] text-muted-foreground">
              <span>Select {label}</span>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange("")
                    setOpen(false)
                  }}
                  className="text-[10px] text-destructive hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelectDate}
              initialFocus
              className="rounded-md border border-border/40"
            />
          </PopoverContent>
        </Popover>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-7 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            title="Clear date"
          >
            <X size={11} />
          </button>
        )}
      </div>
    </div>
  )
}

export function VisitorFilterBar({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  selectedDevice,
  setSelectedDevice,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onReset,
  locations = []
}: VisitorFilterBarProps) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] items-end bg-secondary/10 p-4 rounded border border-border/60 w-full max-w-full font-mono text-xs shadow-inner">
      
      {/* Search Input Component */}
      <div className="space-y-1.5 min-w-0">
        <label className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 font-bold">
          <Search size={12} className="text-blue-500" /> Search Name / Email
        </label>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Name or email..."
            className="w-full h-9 bg-background/80 border border-border hover:border-foreground/50 rounded px-3 text-xs text-foreground font-mono placeholder:text-muted-foreground/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Location Dropdown Component */}
      <div className="space-y-1.5 min-w-0">
        <label className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 font-bold">
          <MapPin size={12} className="text-emerald-500" /> Location
        </label>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full h-9 bg-background/80 border-border hover:border-foreground/50 px-3 text-xs font-mono text-foreground focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 cursor-pointer">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border text-foreground font-mono text-xs">
            <SelectItem value="ALL">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Device Dropdown Component */}
      <div className="space-y-1.5 min-w-0">
        <label className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 font-bold">
          <Smartphone size={12} className="text-indigo-500" /> Device
        </label>
        <Select value={selectedDevice} onValueChange={setSelectedDevice}>
          <SelectTrigger className="w-full h-9 bg-background/80 border-border hover:border-foreground/50 px-3 text-xs font-mono text-foreground focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer">
            <SelectValue placeholder="All Devices" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border text-foreground font-mono text-xs">
            <SelectItem value="ALL">All Devices</SelectItem>
            <SelectItem value="Desktop">Desktop</SelectItem>
            <SelectItem value="Mobile">Mobile</SelectItem>
            <SelectItem value="Tablet">Tablet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom From Date Component */}
      <CustomDatePicker
        label="From Date"
        value={startDate}
        onChange={setStartDate}
        iconColorClass="text-amber-500"
      />

      {/* Custom To Date Component */}
      <CustomDatePicker
        label="To Date"
        value={endDate}
        onChange={setEndDate}
        iconColorClass="text-amber-500"
      />

      {/* Reset Button (Standalone Grid Item) */}
      <div className="space-y-1.5 min-w-0 flex flex-col justify-end">
        <button
          onClick={onReset}
          title="Reset All Filters"
          className="h-9 px-3.5 border border-border bg-secondary/30 hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all rounded text-[10px] uppercase font-bold flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
        >
          <X size={13} />
          <span>RESET</span>
        </button>
      </div>

    </div>
  )
}
