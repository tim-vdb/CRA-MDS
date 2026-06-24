import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../../../back/lib/api-error";
import * as InvoicesService from "../../../back/services/invoices.service";

// POST /api/invoices
// Body: { activityId, clientId, amountHT, tvaRate? }
// Crée ou met à jour l'invoice d'une activité.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      activityId: string;
      clientId: string;
      amountHT: number;
      tvaRate?: number;
    };

    const { activityId, clientId, amountHT, tvaRate } = body;

    if (!activityId || !clientId || amountHT === undefined || amountHT < 0) {
      return NextResponse.json(
        { error: "Les champs activityId, clientId et amountHT sont requis" },
        { status: 400 }
      );
    }

    const invoice = await InvoicesService.upsertInvoiceForActivity(
      activityId,
      clientId,
      amountHT,
      tvaRate
    );

    return NextResponse.json(invoice, { status: 200 });
  } catch (e) {
    return handleApiError(e);
  }
}
