import { prisma } from "../../lib/prisma";

export const ActivitiesRepository = {
  findByMonthYear: async (userId: string, month: number, year: number) => {
    return prisma.clients.findMany({
      where: {
        isActive: true,
        userId,
      },
      select: {
        id: true,
        name: true,
        activities: {
          where: { month, year },
          select: {
            id: true,
            date: true,
            daysWorked: true,
            hoursWorked: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  },

  findClientOwner: async (clientId: string) => {
    return prisma.clients.findUnique({
      where: { id: clientId },
      select: { userId: true },
    });
  },

  upsertActivityRecord: async (clientId: string, date: Date, daysWorked: number) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (daysWorked === 0) {
      await prisma.activity.deleteMany({
        where: { clientId, month, year, date },
      });
      return;
    }

    await prisma.activity.upsert({
      where: {
        clientId_date: { clientId, date },
      },
      update: { daysWorked, hoursWorked: daysWorked },
      create: {
        clientId,
        date,
        month,
        year,
        daysWorked,
        hoursWorked: daysWorked,
      },
    });
  },

  findForChart: async (userId: string, month: number, year: number, clientId?: string) => {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    const activities = await prisma.activity.findMany({
      where: {
        date: { gte: start, lt: end },
        client: { userId },
        ...(clientId ? { clientId } : {}),
      },
      select: {
        date: true,
        daysWorked: true,
        client: { select: { id: true, name: true } },
      },
      orderBy: { date: "asc" },
    });

    return activities.map((a) => ({
      date: a.date.toISOString(),
      daysWorked: a.daysWorked,
      clientId: a.client.id,
      clientName: a.client.name,
    }));
  },
};
