"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { requestEmailChange } from "../server/account.action";

interface ChangeEmailDialogProps {
  currentEmail: string;
}

export function ChangeEmailDialog({ currentEmail }: ChangeEmailDialogProps) {
  const [open, setOpen] = useState(false);

  const schema = z.object({
    newEmail: z
      .string()
      .email("Invalid email")
      .refine(
        (val) => val.toLowerCase() !== currentEmail.toLowerCase(),
        "New email must differ from the current one"
      ),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newEmail: "" },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: FormValues) {
    try {
      await requestEmailChange(values.newEmail);
      toast.success("Check your inbox to confirm the change");
      form.reset({ newEmail: "" });
      setOpen(false);
    } catch {
      form.setError("newEmail", { message: "Could not update email" });
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) form.reset({ newEmail: "" });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Request a change
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Change email address
          </DialogTitle>
          <DialogDescription>
            Enter your new email address. The change takes effect immediately.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="new@email.com"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Update email
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
