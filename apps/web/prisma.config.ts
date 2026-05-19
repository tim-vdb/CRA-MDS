import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

export default {
    schema: "src/prisma/schema.prisma",
    migrations: {
        path: "src/prisma/migrations",
        seed: 'tsx src/prisma/seed.ts',
    },
    datasource: {
        url: env("DIRECT_URL")
    }
} satisfies PrismaConfig;