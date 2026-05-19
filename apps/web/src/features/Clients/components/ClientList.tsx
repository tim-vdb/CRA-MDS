"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ChevronRight, Archive, ChevronDown } from "lucide-react";
import type { Clients } from "../../../generated/prisma_client";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../../components/ui/collapsible";
import { cn } from "../../../utils/utils";
import { ClientCardActions } from "./ClientCardActions";

type ClientListItem = Pick<
  Clients,
  "id" | "name" | "company" | "isActive" | "city" | "dailyRate"
>;

function ClientCard({
  client,
  archived = false,
}: {
  client: ClientListItem;
  archived?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative border border-border rounded-xl bg-card",
        "hover:bg-muted/50 hover:border-primary/30 hover:shadow-sm",
        "transition-all",
        archived && "opacity-55 hover:opacity-100"
      )}
    >
      <Link
        href={`/clients/${client.id}`}
        className="flex items-start justify-between gap-3 p-4 pr-2"
      >
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground truncate">{client.name}</p>
          {client.company && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5 truncate">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{client.company}</span>
            </p>
          )}
          {(client.city || client.dailyRate) && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {[client.city, client.dailyRate ? `${client.dailyRate}€/j` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </Link>
      <div className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <ClientCardActions
          clientId={client.id}
          clientName={client.name}
          isActive={client.isActive}
        />
      </div>
    </div>
  );
}

export default function ClientList({
  clients,
  archivedClients,
}: {
  clients: ClientListItem[];
  archivedClients: ClientListItem[];
}) {
  const [archivesOpen, setArchivesOpen] = useState(false);

  return (
    <div className="space-y-6">
      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No clients yet. Create your first one to start tracking activity.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      {archivedClients.length > 0 && (
        <Collapsible open={archivesOpen} onOpenChange={setArchivesOpen}>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground text-xs font-medium h-7 px-3 rounded-full border border-border/60 hover:border-border"
              >
                <Archive className="h-3.5 w-3.5" />
                Archives
                <Badge
                  variant="secondary"
                  className="h-4 min-w-4 px-1 text-[10px] rounded-sm"
                >
                  {archivedClients.length}
                </Badge>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    archivesOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <div className="flex-1 h-px bg-border" />
          </div>

          <CollapsibleContent className="mt-3 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {archivedClients.map((client) => (
                <ClientCard key={client.id} client={client} archived />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
