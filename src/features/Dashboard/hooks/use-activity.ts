"use client"
 
import { useEffect, useTransition, useState } from "react"
import { ActivityWithClient, getActivitiesByMonth } from "../server/activity.action"

 
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
 
export function useActivities(month: number, year: number) {
  const [activities, setCras] = useState<ActivityWithClient[]>([])
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
 
  useEffect(() => {
    setError(null)
    startTransition(async () => {
      try {
        const data = await getActivitiesByMonth(month, year)
        setCras(data)
      } catch {
        setError("Erreur lors du chargement des activités")
      }
    })
  }, [month, year])
 
  const activityDateKeys = new Set(
    activities.map((c) => dateKey(new Date(c.date)))
  )
 
  return { activities, isLoading: isPending, error, activityDateKeys }
}