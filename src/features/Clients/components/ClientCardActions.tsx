"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2, PowerOff, Power, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteClient, toggleClientActive } from "../server/clients.action";
import { cn } from "@/utils/utils";

interface ClientCardActionsProps {
  clientId: string;
  clientName: string;
  isActive: boolean;
}

export function ClientCardActions({ clientId, clientName, isActive }: ClientCardActionsProps) {
  const [isPendingToggle, startToggle] = useTransition();
  const [isPendingDelete, startDelete] = useTransition();

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startToggle(async () => {
      try {
        await toggleClientActive(clientId);
        toast.success(isActive ? `${clientName} archivé.` : `${clientName} réactivé.`);
      } catch {
        toast.error("Une erreur est survenue.");
      }
    });
  }

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startDelete(async () => {
      try {
        await deleteClient(clientId);
        toast.success(`${clientName} supprimé.`);
      } catch {
        toast.error("Une erreur est survenue.");
      }
    });
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className="flex items-center gap-1 shrink-0"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        {/* Toggle active / inactive */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("cursor-pointer",
                isActive
                  ? "h-8 w-8 text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  : "h-8 w-8 text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
              )}
              disabled={isPendingToggle}
              onClick={handleToggle}
              type="button"
            >
              {isPendingToggle ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isActive ? (
                <PowerOff className="h-3.5 w-3.5" />
              ) : (
                <Power className="h-3.5 w-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isActive ? "Archiver le client" : "Réactiver le client"}</TooltipContent>
        </Tooltip>

        {/* Delete */}
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  disabled={isPendingDelete}
                  type="button"
                >
                  {isPendingDelete ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin cursor-pointer" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5 cursor-pointer" />
                  )}
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Supprimer le client</TooltipContent>
          </Tooltip>
          <AlertDialogContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer {clientName} ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement le client ainsi que toutes ses activités. Elle est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white cursor-pointer"
                onClick={handleDelete}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
