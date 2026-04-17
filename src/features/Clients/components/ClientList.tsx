"use client";

import { useRouter } from "next/navigation";

export default function ClientList({ clients }: { clients: any[] }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      {clients.map((client) => (
        <div
          key={client.id}
          onClick={() => router.push(`/clients/${client.id}`)}
          className="p-4 border rounded-xl cursor-pointer hover:bg-muted transition"
        >
          <p className="font-medium">{client.name}</p>
          <p className="text-sm text-muted-foreground">
            {client.company || "Pas de société"}
          </p>
        </div>
      ))}
    </div>
  );
}