import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Clock, Briefcase } from "lucide-react"
import { ActivityWithClient } from "../server/activity.action"

interface ActivityCardProps {
  activity: ActivityWithClient
  onClick?: (activity: ActivityWithClient) => void
}

function getStatus(activity: ActivityWithClient) {
  if (activity.validatedAt) return { label: "Validé", variant: "default" } as const
  if (activity.rejectedAt) return { label: "Refusé", variant: "destructive" } as const
  return { label: "En attente", variant: "secondary" } as const
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
  const status = getStatus(activity)

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-muted/50"
      onClick={() => onClick?.(activity)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{activity.client.name}</p>
            {activity.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {activity.description}
              </p>
            )}
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {activity.daysWorked}j
          </span>
          {activity.hoursWorked != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.hoursWorked}h
            </span>
          )}
        </div>

        {status.variant === "destructive" && activity.rejectionReason && (
          <p className="text-xs text-destructive mt-2 border-t border-destructive/20 pt-2">
            Motif : {activity.rejectionReason}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
