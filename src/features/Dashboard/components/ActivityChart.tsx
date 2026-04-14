"use client"

import { useEffect, useTransition, useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ActivityChartPoint, getActivitiesForChart } from "../server/chart.action"

const chartConfig = {
  daysWorked: {
    label: "Jours travaillés",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const MONTH_LABELS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"]

interface ActivityChartProps {
  year?: number
  clientId?: string
}

export function ActivityChart({ year = new Date().getFullYear(), clientId }: ActivityChartProps) {
  const [data, setData] = useState<ActivityChartPoint[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const result = await getActivitiesForChart(year, clientId)
      setData(result)
    })
  }, [year, clientId])

  const chartData = useMemo(() => {
    const byDate = new Map<string, number>()
    for (const point of data) {
      const d = new Date(point.date)
      const label = `${String(d.getUTCDate()).padStart(2, "0")}/${MONTH_LABELS[d.getUTCMonth()]}`
      byDate.set(label, (byDate.get(label) ?? 0) + point.daysWorked)
    }
    return Array.from(byDate.entries()).map(([date, daysWorked]) => ({ date, daysWorked }))
  }, [data])

  const totalDays = useMemo(() => data.reduce((sum, d) => sum + d.daysWorked, 0), [data])
  const activeClients = useMemo(() => new Set(data.map((d) => d.clientId)).size, [data])
  const avgPerEntry = data.length > 0 ? (totalDays / data.length).toFixed(2) : "0"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Jours travaillés — {year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Total jours</p>
            <p className="text-xl font-medium">{totalDays}j</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Moy. par entrée</p>
            <p className="text-xl font-medium">{avgPerEntry}j</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Clients actifs</p>
            <p className="text-xl font-medium">{activeClients}</p>
          </div>
        </div>

        {isPending ? (
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            Chargement…
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
            Aucune donnée pour cette période
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={50}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}j`}
                domain={[0, "auto"]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${value}j`, "Jours travaillés"]}
                  />
                }
              />
              <Bar
                dataKey="daysWorked"
                fill="var(--color-daysWorked)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
