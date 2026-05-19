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
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../../../components/ui/form";
import { Separator } from "../../../components/ui/separator";

import {
    UpdateClientSchema,
    type UpdateClientInput,
} from "../server/clients.schema";
import { updateClient } from "../server/clients.action";
import type { Clients } from "../../../generated/prisma_client";

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
            toast.success("Client updated");
            setOpen(false);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An error occurred"
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
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit client</DialogTitle>
                    <DialogDescription>
                        Update the details, address and assignment settings for this client.
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
                                Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>
                                                Name <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Client name"
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
                                            <FormLabel>Phone</FormLabel>
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
                                Company
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="company"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Company name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Company name" />
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
                                            <FormLabel>VAT number</FormLabel>
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
                                Address
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Address</FormLabel>
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
                                            <FormLabel>Postal code</FormLabel>
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
                                            <FormLabel>City</FormLabel>
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
                                            <FormLabel>Country</FormLabel>
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
                                Assignment
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="dailyRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Daily rate (€)</FormLabel>
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
                                            <FormLabel>Cap (days)</FormLabel>
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
                                            <FormLabel>Start date</FormLabel>
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
                                            <FormLabel>End date</FormLabel>
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
                                                    Active client
                                                </FormLabel>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Uncheck to archive the client without deleting them.
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
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Save changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
