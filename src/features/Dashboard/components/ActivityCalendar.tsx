"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/utils/utils"
import { fr } from "date-fns/locale"
import { ActivityWithClient } from "../server/activity.action"
import { dateKey, useActivities } from "../hooks/use-activity"
import { ActivityPanel } from "./ActivityPanel"

export function ActivityCalendar() {
  const today = new Date()
  const [selected, setSelected] = useState<Date | undefined>(undefined)
  const [month, setMonth] = useState<Date>(today)
  const [open, setOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const { activities, isLoading, error} = useActivities(
    month.getMonth() + 1,
    month.getFullYear()
  )

  // Extraire la liste unique des clients depuis les activités
  const clients = useMemo(() => {
    const map = new Map<string, string>()
    activities.forEach((a) => {
      if (!map.has(a.clientId)) {
        map.set(a.clientId, a.client.name)
      }
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [activities])

  const selectedClientName = clients.find((c) => c.id === selectedClientId)?.name

  const filteredActivities = useMemo(() => {
    if (!selectedClientId) return activities
    return activities.filter((a) => a.clientId === selectedClientId)
  }, [activities, selectedClientId])

  const filteredDateKeys = useMemo(() => {
    return new Set(filteredActivities.map((a) => dateKey(new Date(a.date))))
  }, [filteredActivities])

  const router = useRouter()

  function handleActivityClick(activity: ActivityWithClient) {
    router.push(`/clients/${activity.clientId}`)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Combobox client */}
      <div className="flex items-center gap-2 w-full max-w-sm">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedClientName ?? "Filtrer par client…"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Rechercher un client…" />
              <CommandList>
                <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                <CommandGroup>
                  {clients.map((client) => (
                    <CommandItem
                      key={client.id}
                      value={client.name}
                      onSelect={() => {
                        setSelectedClientId(
                          selectedClientId === client.id ? null : client.id
                        )
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedClientId === client.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {client.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Bouton reset */}
        {selectedClientId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedClientId(null)}
            aria-label="Réinitialiser le filtre"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card>
          <CardContent className="p-4">
            {error && <p className="text-xs text-destructive mb-2">{error}</p>}
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              month={month}
              onMonthChange={setMonth}
              locale={fr}
              showOutsideDays
              disabled={isLoading}
              modifiers={{
                hasActivity: (date) => filteredDateKeys.has(dateKey(date)),
              }}
              modifiersClassNames={{
                hasActivity:
                  "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary after:content-['']",
              }}
            />
          </CardContent>
        </Card>

        <Card className="min-h-[360px]">
          <CardContent className="p-4 h-full">
            <ActivityPanel
              selectedDate={selected}
              activities={filteredActivities}
              isLoading={isLoading}
              onActivityClick={handleActivityClick}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}