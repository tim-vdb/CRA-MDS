// app/clients/page.tsx
import { prisma } from "@/lib/prisma";
import ClientList from "@/features/Clients/components/ClientList";
import CreateClientModal from "@/features/Clients/components/CreateClientModal";

export default async function ClientsPage() {
  const clients = await prisma.clients.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <CreateClientModal />
      </div>

      <ClientList clients={clients} />
    </div>
  );
}