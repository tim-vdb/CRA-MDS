"use client"

import { useMemo, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { fr } from "date-fns/locale"
import { ActivityWithClient } from "../server/activity.action"
import { dateKey, useActivities } from "../hooks/use-activity"
import { ActivityPanel } from "./ActivityPanel"

export function ActivityCalendar() {
  const today = new Date()
  const [selected, setSelected] = useState<Date | undefined>(undefined)
  const [month, setMonth] = useState<Date>(today)
  const [search, setSearch] = useState("")

  const { activities, isLoading, error, activityDateKeys } = useActivities(
    month.getMonth() + 1,
    month.getFullYear()
  )

  const filteredActivities = useMemo(() => {
    if (!search.trim()) return activities
    const q = search.trim().toLowerCase()
    return activities.filter((a) => a.client.name.toLowerCase().includes(q))
  }, [activities, search])

  const filteredDateKeys = useMemo(() => {
    return new Set(filteredActivities.map((a) => dateKey(new Date(a.date))))
  }, [filteredActivities])

  function handleActivityClick(activity: ActivityWithClient) {
    console.log("Activity clicked:", activity.id)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtrer par client…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
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
