// app/clients/page.tsx
import { prisma } from "../../lib/prisma";
import { getUser } from "../../lib/auth-session";
import ClientList from "../../features/Clients/components/ClientList";
import CreateClientModal from "../../features/Clients/components/CreateClientModal";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ onboarding?: string }>;

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const onboarding = params.onboarding === "1";

  const [clients, archivedClients] = await Promise.all([
    prisma.clients.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.clients.findMany({
      where: { userId: user.id, isActive: false },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl font-bold">Clients</h1>
        <CreateClientModal autoOpen={onboarding} onboardingMode={onboarding} />
      </div>

      <ClientList clients={clients} archivedClients={archivedClients} />
    </div>
  );
}
