// app/clients/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
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

  await prisma.clients.create({
    data: {
      name: getString("name")!,

      email: getString("email"),
      phone: getString("phone"),
      company: getString("company"),
      address: getString("address"),
      city: getString("city"),
      postalCode: getString("postalCode"),
      country: getString("country") || "France",

      siret: getString("siret"),
      vatNumber: getString("vatNumber"),

      dailyRate: getFloat("dailyRate"),
      isActive,

      startDate: getDate("startDate"),
      endDate: getDate("endDate"),
    },
  });

  revalidatePath("/clients");
}