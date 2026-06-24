import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../../../../back/lib/api-error";
import * as InvoicesService from "../../../../back/services/invoices.service";

// PATCH /api/invoices/[id]
// Body: { amountHT, tvaRate? }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json() as { amountHT: number; tvaRate?: number };
    const { amountHT, tvaRate } = body;

    if (amountHT === undefined || amountHT < 0) {
      return NextResponse.json({ error: "amountHT est requis" }, { status: 400 });
    }

    const invoice = await InvoicesService.updateInvoiceAmount(id, amountHT, tvaRate);
    return NextResponse.json(invoice);
  } catch (e) {
    return handleApiError(e);
  }
}
