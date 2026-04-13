"use server"
 
import { prisma } from "@/lib/prisma"
 
export async function getActivitiesByMonth(month: number, year: number) {
  const start = new Date(Date.UTC(year, month - 1, 1))
const end = new Date(Date.UTC(year, month, 1))

  const activities = await prisma.activity.findMany({
    
    where: {
      date: {
        gte: start,
        lt: end,
      },
    },
    include: {
      client: { select: { id: true, name: true } },
    },
    orderBy: { date: "asc" },
  })

  return activities.map((activity) => ({
    ...activity,
    date: activity.date.toISOString(),
    validatedAt: activity.validatedAt?.toISOString() ?? null,
    rejectedAt: activity.rejectedAt?.toISOString() ?? null,
    createdAt: activity.createdAt.toISOString(),
    updatedAt: activity.updatedAt.toISOString(),
  }))
  
}
 
export type ActivityWithClient = Awaited<ReturnType<typeof getActivitiesByMonth>>[number]