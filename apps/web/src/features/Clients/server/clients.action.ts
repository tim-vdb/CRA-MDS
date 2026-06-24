"use server";

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import { getUser } from "../../../lib/auth-session";
import {
  CreateClientSchema,
  UpdateClientSchema,
  type CreateClientInput,
  type UpdateClientInput,
} from "./clients.schema";

export async function createClient(input: CreateClientInput) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const data = CreateClientSchema.parse(input);

  const siret = data.siret?.trim() || null;
  const email = data.email?.trim() || null;

  if (siret) {
    const existingSiret = await prisma.clients.findFirst({
      where: { userId: user.id, siret },
    });
    if (existingSiret) {
      throw new Error("SIRET_ALREADY_EXISTS");
    }
  }

  if (email) {
    const existingEmail = await prisma.clients.findFirst({
      where: { userId: user.id, email },
    });
    if (existingEmail) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
  }

  const created = await prisma.clients.create({
    data: {
      name: data.name,
      userId: user.id,

      email,
      phone: data.phone || null,
      company: data.company || null,
      address: data.address || null,
      city: data.city || null,
      postalCode: data.postalCode || null,
      country: data.country || "France",

      siret,
      vatNumber: data.vatNumber || null,

      dailyRate: data.dailyRate ?? null,
      maxDays: data.maxDays ?? null,
      isActive: data.isActive,

      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });

  revalidatePath("/clients");
  revalidatePath("/");

  return { id: created.id };
}

export async function updateClient(id: string, input: UpdateClientInput) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const client = await prisma.clients.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!client || client.userId !== user.id) {
    throw new Error("Unauthorized: Client does not belong to this user");
  }

  const data = UpdateClientSchema.parse(input);

  await prisma.clients.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email ? data.email : null,
      phone: data.phone ? data.phone : null,
      company: data.company ? data.company : null,
      address: data.address ? data.address : null,
      city: data.city ? data.city : null,
      postalCode: data.postalCode ? data.postalCode : null,
      country: data.country ? data.country : "France",
      siret: data.siret ? data.siret : null,
      vatNumber: data.vatNumber ? data.vatNumber : null,
      dailyRate: data.dailyRate ?? null,
      maxDays: data.maxDays ?? null,
      isActive: data.isActive,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });

  revalidatePath(`/clients/${id}`);
  revalidatePath(`/clients`);
}

export async function toggleClientActive(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const client = await prisma.clients.findUnique({
    where: { id },
    select: { userId: true, isActive: true },
  });

  if (!client || client.userId !== user.id) throw new Error("Unauthorized");

  await prisma.clients.update({
    where: { id },
    data: { isActive: !client.isActive },
  });

  revalidatePath("/clients");
}

export async function deleteClient(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const client = await prisma.clients.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!client || client.userId !== user.id) throw new Error("Unauthorized");

  await prisma.clients.delete({ where: { id } });

  revalidatePath("/clients");
  revalidatePath("/");
}
