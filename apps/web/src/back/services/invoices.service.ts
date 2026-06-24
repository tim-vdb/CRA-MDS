import { getUser } from "../../lib/auth-session";
import { prisma } from "../../lib/prisma";

// Vérifie que l'activité appartient bien à l'utilisateur connecté
async function assertActivityOwner(activityId: string, userId: string) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    select: { client: { select: { userId: true } } },
  });
  if (!activity) throw new Error("NOT_FOUND");
  if (activity.client?.userId !== userId) throw new Error("FORBIDDEN");
  return activity;
}

// Vérifie que l'invoice appartient bien à l'utilisateur connecté
async function assertInvoiceOwner(invoiceId: string, userId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { client: { select: { userId: true } } },
  });
  if (!invoice) throw new Error("NOT_FOUND");
  if (invoice.client?.userId !== userId) throw new Error("FORBIDDEN");
  return invoice;
}

function generateNumber() {
  const now = new Date();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `FACT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${rand}`;
}

export async function upsertInvoiceForActivity(
  activityId: string,
  clientId: string,
  amountHT: number,
  tvaRate: number = 20
) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  await assertActivityOwner(activityId, user.id);

  const tvaAmount = amountHT * (tvaRate / 100);
  const amountTTC = amountHT + tvaAmount;

  // S'il existe déjà une invoice pour cette activité, on la met à jour
  const existing = await prisma.invoice.findFirst({
    where: { craId: activityId },
    select: { id: true },
  });

  if (existing) {
    return prisma.invoice.update({
      where: { id: existing.id },
      data: { amountHT, amountTTC, tvaRate, tvaAmount },
    });
  }

  return prisma.invoice.create({
    data: {
      craId: activityId,
      clientId,
      amountHT,
      amountTTC,
      tvaRate,
      tvaAmount,
      status: "DRAFT",
      number: generateNumber(),
    },
  });
}

export async function updateInvoiceAmount(
  invoiceId: string,
  amountHT: number,
  tvaRate: number = 20
) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  await assertInvoiceOwner(invoiceId, user.id);

  const tvaAmount = amountHT * (tvaRate / 100);
  const amountTTC = amountHT + tvaAmount;

  return prisma.invoice.update({
    where: { id: invoiceId },
    data: { amountHT, amountTTC, tvaAmount },
  });
}
