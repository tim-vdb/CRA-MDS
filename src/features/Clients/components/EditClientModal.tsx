"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import {
    UpdateClientSchema,
    type UpdateClientInput,
} from "../clients.schema";
import { updateClient } from "../server/clients.action";
import type { Clients } from "@/generated/prisma_client";

function toDateInputValue(date: Date | string | null | undefined): string {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

interface EditClientModalProps {
    client: Clients;
}

export default function EditClientModal({ client }: EditClientModalProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<UpdateClientInput>({
        resolver: zodResolver(UpdateClientSchema),
        defaultValues: {
            name: client.name,
            email: client.email ?? "",
            phone: client.phone ?? "",
            company: client.company ?? "",
            address: client.address ?? "",
            city: client.city ?? "",
            postalCode: client.postalCode ?? "",
            country: client.country ?? "France",
            siret: client.siret ?? "",
            vatNumber: client.vatNumber ?? "",
            dailyRate: client.dailyRate ?? null,
            maxDays: client.maxDays ?? null,
            isActive: client.isActive,
            startDate: toDateInputValue(client.startDate),
            endDate: toDateInputValue(client.endDate),
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    async function onSubmit(values: UpdateClientInput) {
        try {
            await updateClient(client.id, values);
            toast.success("Client mis à jour");
            setOpen(false);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Une erreur est survenue"
            );
        }
    }

    function handleOpenChange(next: boolean) {
        setOpen(next);
        if (next) {
            // Reset form to current client values when reopening
            form.reset({
                name: client.name,
                email: client.email ?? "",
                phone: client.phone ?? "",
                company: client.company ?? "",
                address: client.address ?? "",
                city: client.city ?? "",
                postalCode: client.postalCode ?? "",
                country: client.country ?? "France",
                siret: client.siret ?? "",
                vatNumber: client.vatNumber ?? "",
                dailyRate: client.dailyRate ?? null,
                maxDays: client.maxDays ?? null,
                isActive: client.isActive,
                startDate: toDateInputValue(client.startDate),
                endDate: toDateInputValue(client.endDate),
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    Modifier
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier le client</DialogTitle>
                    <DialogDescription>
                        Met à jour les informations, l&apos;adresse et les paramètres de
                        mission de ce client.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        noValidate
                    >
                        {/* ── Informations ────────────────────────────── */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Informations
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>
                                                Nom <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Nom du client"
                                                    autoFocus
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="contact@client.com"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Téléphone</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="+33 6 12 34 56 78"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        <Separator />

                        {/* ── Entreprise ──────────────────────────────── */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Entreprise
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="company"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Société</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Nom de la société" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="siret"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SIRET</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="123 456 789 00012" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vatNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>N° TVA</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="FR12345678901" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        <Separator />

                        {/* ── Adresse ─────────────────────────────────── */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Adresse
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Adresse</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="12 rue de la Paix" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="postalCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Code postal</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="75001" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ville</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Paris" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Pays</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="France" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        <Separator />

                        {/* ── Mission ─────────────────────────────────── */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Mission
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="dailyRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>TJM (€)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    inputMode="decimal"
                                                    step="any"
                                                    placeholder="700"
                                                    name={field.name}
                                                    ref={field.ref}
                                                    onBlur={field.onBlur}
                                                    value={
                                                        field.value === null ||
                                                        field.value === undefined
                                                            ? ""
                                                            : field.value
                                                    }
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        field.onChange(v === "" ? null : Number(v));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maxDays"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Plafond (jours)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    inputMode="decimal"
                                                    step="any"
                                                    placeholder="13"
                                                    name={field.name}
                                                    ref={field.ref}
                                                    onBlur={field.onBlur}
                                                    value={
                                                        field.value === null ||
                                                        field.value === undefined
                                                            ? ""
                                                            : field.value
                                                    }
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        field.onChange(v === "" ? null : Number(v));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date de début</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date de fin</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2 space-y-0 sm:col-span-2 rounded-md border p-3">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(checked) =>
                                                        field.onChange(checked === true)
                                                    }
                                                />
                                            </FormControl>
                                            <div className="flex-1">
                                                <FormLabel className="cursor-pointer">
                                                    Client actif
                                                </FormLabel>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Décocher pour archiver le client sans le supprimer.
                                                </p>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        {/* ── Footer actions ──────────────────────────── */}
                        <div className="flex justify-end gap-2 pt-2 border-t -mx-6 px-6 -mb-6 pb-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
