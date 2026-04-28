"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getActivities(month: number, year: number) {
  return await prisma.clients.findMany({
    where: { isActive: true },
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
}

export async function upsertActivity(
  clientId: string,
  date: Date,
  daysWorked: number
) {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (daysWorked === 0) {
    await prisma.activity.deleteMany({
      where: { clientId, month, year, date },
    });
    revalidatePath("/");
    return;
  }

  await prisma.activity.upsert({
    where: {
      clientId_date: { clientId, date },
    },
    update: { daysWorked, hoursWorked: daysWorked},
    create: {
      clientId,
      date,
      month,
      year,
      daysWorked,
      hoursWorked: daysWorked,
    },
  });

  revalidatePath("/");
}