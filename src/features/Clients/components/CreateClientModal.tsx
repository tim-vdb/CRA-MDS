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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ New client</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a client</DialogTitle>
        </DialogHeader>

        <form
          action={async (formData) => {
            await createClient(formData);
            setOpen(false);
          }}
          className="space-y-6"
        >
          {/* 👤 Infos principales */}
          <div className="space-y-2">
            <h3 className="font-semibold">Details</h3>
            <Input name="name" placeholder="Name *" required />
            <Input name="email" placeholder="Email" />
            <Input name="phone" placeholder="Phone" />
          </div>

          {/* 🏢 Entreprise */}
          <div className="space-y-2">
            <h3 className="font-semibold">Company</h3>
            <Input name="company" placeholder="Company name" />
            <Input name="siret" placeholder="SIRET" />
            <Input name="vatNumber" placeholder="VAT number" />
          </div>

          {/* 📍 Adresse */}
          <div className="space-y-2">
            <h3 className="font-semibold">Address</h3>
            <Input name="address" placeholder="Address" />
            <Input name="city" placeholder="City" />
            <Input name="postalCode" placeholder="Postal code" />
            <Input name="country" placeholder="Country" defaultValue="France" />
          </div>

          {/* 💰 Business */}
          <div className="space-y-2">
            <h3 className="font-semibold">Business</h3>
            <Input name="dailyRate" type="number" placeholder="Daily rate (€)" />
          </div>

          {/* 📅 Dates */}
          <div className="space-y-2">
            <h3 className="font-semibold">Assignment</h3>
            <Input name="startDate" type="date" />
            <Input name="endDate" type="date" />
          </div>

          {/* ✅ Actif */}
          <div className="flex items-center gap-2">
            <Checkbox name="isActive" defaultChecked />
            <span>Active client</span>
          </div>

          <Button type="submit" className="w-full">
            Create client
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}