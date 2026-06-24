import { prisma } from "../../lib/prisma";

export const UsersRepository = {
  findAll: async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  },

  deleteById: async (id: string) => {
    return prisma.user.delete({ where: { id } });
  },
};
