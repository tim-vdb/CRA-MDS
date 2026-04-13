

import { CalendarDays } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ActivityWithClient } from "../server/activity.action"
import { ActivityCard } from "./ActivityCard"

interface ActivityPanelProps {
  selectedDate: Date | undefined
  activities: ActivityWithClient[]
  isLoading: boolean
  onActivityClick?: (activity: ActivityWithClient) => void
}

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function ActivityPanel({ selectedDate, activities, isLoading, onActivityClick }: ActivityPanelProps) {
  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2 py-12">
        <CalendarDays className="h-8 w-8 opacity-40" />
        <p className="text-sm">Sélectionnez une date pour voir les activités</p>
      </div>
    )
  }

  const label = DATE_FORMAT.format(selectedDate)
  const capitalised = label.charAt(0).toUpperCase() + label.slice(1)

  const dayActivities = activities.filter((c) => {
    const d = new Date(c.date)
    return (
      d.getFullYear() === selectedDate.getFullYear() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getDate() === selectedDate.getDate()
    )
  })

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <p className="text-sm font-medium">{capitalised}</p>
        <p className="text-xs text-muted-foreground">
          {isLoading ? "Chargement…" : `${dayActivities.length} activité${dayActivities.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ) : dayActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center text-muted-foreground gap-2 py-8 border border-dashed rounded-lg">
          <p className="text-sm">Aucune activité pour cette date</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto">
          {dayActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onClick={onActivityClick} />
          ))}
        </div>
      )}
    </div>
  )
}
