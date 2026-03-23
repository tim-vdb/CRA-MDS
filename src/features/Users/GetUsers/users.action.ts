'use server';

import { prisma } from '@/lib/prisma'; // adapte selon ton setup

export async function GetUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Formater la date ici (en string ISO ou autre format universel)
    const usersWithFormattedDate = users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString().slice(0, 10), // YYYY-MM-DD
    }));

    return usersWithFormattedDate;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    return [];
  }
}
