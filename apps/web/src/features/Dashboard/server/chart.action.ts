"use server"

import { prisma } from "../../../lib/prisma"
import { getUser } from "../../../lib/auth-session"

export async function getActivitiesForChart(month: number, year: number, clientId?: string) {
  const user = await getUser()

  if (!user) {
    throw new Error("Unauthorized: User not authenticated")
  }

  const start = new Date(Date.UTC(year, month - 1, 1))
  const end = new Date(Date.UTC(year, month, 1))

  // Si un clientId est spécifié, vérifier qu'il appartient à l'utilisateur
  if (clientId) {
    const client = await prisma.clients.findUnique({
      where: { id: clientId },
      select: { userId: true },
    })

    if (!client || client.userId !== user.id) {
      throw new Error("Unauthorized: Client does not belong to this user")
    }
  }

  const activities = await prisma.activity.findMany({
    where: {
      date: { gte: start, lt: end },
      client: {
        userId: user.id,
      },
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
