"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "../server/clients.action";

export default function CreateClientModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      await createClient(formData);
      setOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur s'est produite";
      
      if (errorMessage === "SIRET_ALREADY_EXISTS") {
        setError("Ce SIRET existe déjà dans la base de données");
      } else if (errorMessage === "EMAIL_ALREADY_EXISTS") {
        setError("Cet email existe déjà dans la base de données");
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Nouveau client</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un client</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          {/* 👤 Infos principales */}
          <div className="space-y-2">
            <h3 className="font-semibold">Informations</h3>
            <Input name="name" placeholder="Nom *" required />
            <Input name="email" placeholder="Email" />
            <Input name="phone" placeholder="Téléphone" />
          </div>

          {/* 🏢 Entreprise */}
          <div className="space-y-2">
            <h3 className="font-semibold">Entreprise</h3>
            <Input name="company" placeholder="Société" />
            <Input name="siret" placeholder="SIRET" />
            <Input name="vatNumber" placeholder="TVA" />
          </div>

          {/* 📍 Adresse */}
          <div className="space-y-2">
            <h3 className="font-semibold">Adresse</h3>
            <Input name="address" placeholder="Adresse" />
            <Input name="city" placeholder="Ville" />
            <Input name="postalCode" placeholder="Code postal" />
            <Input name="country" placeholder="Pays" defaultValue="France" />
          </div>

          {/* 💰 Business */}
          <div className="space-y-2">
            <h3 className="font-semibold">Business</h3>
            <Input name="dailyRate" type="number" placeholder="TJM (€)" />
          </div>

          {/* 📅 Dates */}
          <div className="space-y-2">
            <h3 className="font-semibold">Mission</h3>
            <Input name="startDate" type="date" />
            <Input name="endDate" type="date" />
          </div>

          {/* ✅ Actif */}
          <div className="flex items-center gap-2">
            <Checkbox name="isActive" defaultChecked />
            <span>Client actif</span>
          </div>

          <Button type="submit" className="w-full">
            Créer le client
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}