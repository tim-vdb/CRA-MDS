import { prisma } from "../../lib/prisma";
import type { CreateClientInput, UpdateClientInput } from "@/features/Clients/server/clients.schema";

export const ClientsRepository = {
  findAllByUser: async (userId: string) => {
    return prisma.clients.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: async (id: string) => {
    return prisma.clients.findUnique({
      where: { id },
    });
  },

  findByUserAndSiret: async (userId: string, siret: string) => {
    return prisma.clients.findFirst({
      where: { userId, siret },
    });
  },

  findByUserAndEmail: async (userId: string, email: string) => {
    return prisma.clients.findFirst({
      where: { userId, email },
    });
  },

  create: async (userId: string, data: CreateClientInput) => {
    const siret = data.siret?.trim() || null;
    const email = data.email?.trim() || null;

    return prisma.clients.create({
      data: {
        name: data.name,
        userId,
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
  },

  update: async (id: string, data: UpdateClientInput) => {
    return prisma.clients.update({
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
  },

  toggleActive: async (id: string, currentIsActive: boolean) => {
    return prisma.clients.update({
      where: { id },
      data: { isActive: !currentIsActive },
    });
  },

  remove: async (id: string) => {
    return prisma.clients.delete({ where: { id } });
  },
};
