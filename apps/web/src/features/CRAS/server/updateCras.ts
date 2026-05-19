"use server";

import { prisma } from "../../../lib/prisma";

export async function updateCras(
  craUpdates: Record<string, { daysWorked: string }>
) {
  try {
    const updates = Object.entries(craUpdates).map(([craId, data]) => {
      const daysWorked = parseFloat(data.daysWorked) || 0;
      return prisma.activity.update({
        where: { id: craId },
        data: { daysWorked },
      });
    });

    await Promise.all(updates);

    return {
      success: true,
      message: "CRA mis à jour avec succès",
    };
  } catch (error) {
    console.error("Error updating CRAs:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour des CRA",
    };
  }
}
