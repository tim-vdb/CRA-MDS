// app/clients/page.tsx
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth-session";
import ClientList from "@/features/Clients/components/ClientList";
import CreateClientModal from "@/features/Clients/components/CreateClientModal";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const clients = await prisma.clients.findMany({
    where: { userId: user.id },
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