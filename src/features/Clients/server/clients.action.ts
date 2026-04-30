"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth-session";
import { UpdateClientSchema, type UpdateClientInput } from "../clients.schema";

export async function createClient(formData: FormData) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const getString = (key: string) => {
    const value = formData.get(key);
    return value ? String(value) : null;
  };

  const getFloat = (key: string) => {
    const value = formData.get(key);
    return value ? parseFloat(String(value)) : null;
  };

  const getDate = (key: string) => {
    const value = formData.get(key);
    return value ? new Date(String(value)) : null;
  };

  const isActive = formData.get("isActive") === "on";
  const siret = getString("siret");
  const email = getString("email");

  // Vérifier si l'utilisateur a déjà un client avec ce SIRET
  if (siret) {
    const existingSiret = await prisma.clients.findFirst({
      where: { userId: user.id, siret },
    });
    if (existingSiret) {
      throw new Error("SIRET_ALREADY_EXISTS");
    }
  }

  // Vérifier si l'utilisateur a déjà un client avec cet email
  if (email) {
    const existingEmail = await prisma.clients.findFirst({
      where: { userId: user.id, email },
    });
    if (existingEmail) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
  }

  await prisma.clients.create({
    data: {
      name: getString("name")!,
      userId: user.id,

      email,
      phone: getString("phone"),
      company: getString("company"),
      address: getString("address"),
      city: getString("city"),
      postalCode: getString("postalCode"),
      country: getString("country") || "France",

      siret,
      vatNumber: getString("vatNumber"),

      dailyRate: getFloat("dailyRate"),
      isActive,

      startDate: getDate("startDate"),
      endDate: getDate("endDate"),
    },
  });

  revalidatePath("/clients");
}

export async function updateClient(id: string, input: UpdateClientInput) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  // Vérifier que le client appartient à l'utilisateur
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
