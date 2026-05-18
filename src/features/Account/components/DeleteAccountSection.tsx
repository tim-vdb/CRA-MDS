"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { deleteAccount } from "../server/account.action";
import { authClient } from "@/lib/auth-client";

export function DeleteAccountSection({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmation, setConfirmation] = useState("");
  const [open, setOpen] = useState(false);

  const confirmed = confirmation === userEmail;

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteAccount();
        await authClient.signOut();
        toast.success("Your account has been deleted.");
        router.push("/login");
      } catch {
        toast.error("An error occurred while deleting your account.");
      }
    });
  }

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          Danger zone
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={open} onOpenChange={(o: boolean) => { setOpen(o); if (!o) setConfirmation(""); }}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-2 cursor-pointer text-white">
              <Trash2 className="h-4 w-4" />
              Delete my account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete your account?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <span className="block">
                  This will permanently delete your account, all your clients, activities, and invoices.
                  <strong className="text-foreground"> There is no going back.</strong>
                </span>
                <span className="block pt-2">
                  Type your email address <strong className="text-foreground">{userEmail}</strong> to confirm.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              placeholder={userEmail}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="mt-1"
              autoComplete="off"
            />
            <AlertDialogFooter className="mt-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={!confirmed || isPending}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  handleDelete();
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2 cursor-pointer text-white"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Yes, delete my account
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
