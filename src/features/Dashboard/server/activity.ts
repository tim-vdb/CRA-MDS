"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth-session";

export async function getActivities(month: number, year: number) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  return await prisma.clients.findMany({
    where: {
      isActive: true,
      userId: user.id,
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
}

export async function upsertActivity(
  clientId: string,
  date: Date,
  daysWorked: number
) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  // Vérifier que le client appartient à l'utilisateur
  const client = await prisma.clients.findUnique({
    where: { id: clientId },
    select: { userId: true },
  });

  if (!client || client.userId !== user.id) {
    throw new Error("Unauthorized: Client does not belong to this user");
  }

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