"use client"

import { useEffect, useTransition, useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { ChevronLeft, ChevronRight, CalendarDays, TrendingUp, Users } from "lucide-react"
import { ChartConfig, ChartContainer, ChartTooltip } from "../../../components/ui/chart"
import { ActivityChartPoint, getActivitiesForChart } from "../server/chart.action"
import { useActivityRefresh } from "../context/ActivityRefreshContext"

const MONTHS_FR = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const chartConfig = {
  daysWorked: { label: "Days worked", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

interface ActivityChartProps {
  clientId?: string
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}

export function ActivityChart({ clientId }: ActivityChartProps) {
  const today = new Date()
  const { refreshCounter } = useActivityRefresh()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(today.getFullYear())
  const [data, setData] = useState<ActivityChartPoint[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const result = await getActivitiesForChart(month, year, clientId)
      setData(result)
    })
  }, [month, year, clientId, refreshCounter])

  const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear()

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }

  function nextMonth() {
    if (isCurrentMonth) return
    if (month === 12) { setMonth(1); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  const chartData = useMemo(() => {
    const byDay = new Map<number, number>()
    for (const point of data) {
      const day = new Date(point.date).getDate()
      byDay.set(day, (byDay.get(day) ?? 0) + point.daysWorked)
    }
    return Array.from({ length: getDaysInMonth(month, year) }, (_, i) => ({
      day: i + 1,
      daysWorked: byDay.get(i + 1) ?? 0,
    }))
  }, [data, month, year])

  const totalDays = useMemo(() => data.reduce((sum, d) => sum + d.daysWorked, 0), [data])
  const activeClients = useMemo(() => new Set(data.map((d) => d.clientId)).size, [data])
  const activeDays = useMemo(() => new Set(data.map((d) => new Date(d.date).getDate())).size, [data])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4 border-b bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">Monthly activity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Days worked per calendar day</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border bg-background px-1 py-0.5 self-start sm:self-auto">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth} disabled={isPending}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="w-32 sm:w-36 text-center text-sm font-medium tabular-nums">
              {MONTHS_FR[month - 1]} {year}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth} disabled={isPending || isCurrentMonth}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="flex items-center gap-3 rounded-xl border p-3">
            <div className="rounded-lg bg-primary/10 p-2 shrink-0">
              <CalendarDays className="h-4 w-4 text-primary " />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Total days</p>
              <p className="text-xl font-semibold">{totalDays}j</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border p-3">
            <div className="rounded-lg bg-primary/10 p-2 shrink-0">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Active days</p>
              <p className="text-xl font-semibold">{activeDays}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border p-3">
            <div className="rounded-lg bg-primary/10 p-2 shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Active clients</p>
              <p className="text-xl font-semibold">{activeClients}</p>
            </div>
          </div>
        </div>

        {isPending ? (
          <div className="h-52 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xs">Loading…</span>
          </div>
        ) : totalDays === 0 ? (
          <div className="h-52 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
            <CalendarDays className="h-8 w-8 opacity-30" />
            <p className="text-sm">No activity this month</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="35%">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-daysWorked)" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="var(--color-daysWorked)" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                interval={4}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}j`}
                domain={[0, "auto"]}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const entry = payload[0]
                  const dayNum = entry?.payload?.day as number
                  const val = Number(entry?.value ?? 0)
                  return (
                    <div className="rounded-lg border bg-popover px-3 py-2 shadow-lg text-xs">
                      <p className="font-semibold mb-1">
                        {String(dayNum).padStart(2, "0")} {MONTHS_FR[month - 1]} {year}
                      </p>
                      <p className="text-muted-foreground">
                        {val === 0
                          ? "No activity"
                          : `${val} day${val > 1 ? "s" : ""} worked`}
                      </p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="daysWorked" radius={[4, 4, 2, 2]} maxBarSize={20}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.daysWorked > 0 ? "url(#barGradient)" : "hsl(var(--muted))"}
                    fillOpacity={entry.daysWorked > 0 ? 1 : 0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
