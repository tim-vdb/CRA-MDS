"use server"

import { prisma } from "@/lib/prisma"

export async function getActivitiesForChart(year: number, clientId?: string) {
  const start = new Date(Date.UTC(year, 0, 1))
  const end = new Date(Date.UTC(year + 1, 0, 1))

  const activities = await prisma.activity.findMany({
    where: {
      date: { gte: start, lt: end },
      ...(clientId ? { clientId } : {}),
    },
    select: {
      date: true,
      daysWorked: true,
      client: { select: { id: true, name: true } },
    },
    orderBy: { date: "asc" },
  })

  return activities.map((a) => ({
    date: a.date.toISOString(),
    daysWorked: a.daysWorked,
    clientId: a.client.id,
    clientName: a.client.name,
  }))
}

export type ActivityChartPoint = Awaited<ReturnType<typeof getActivitiesForChart>>[number]
