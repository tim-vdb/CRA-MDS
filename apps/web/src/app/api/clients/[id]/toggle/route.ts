import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../../../../../back/lib/api-error";
import * as ClientsService from "../../../../../back/services/clients.service";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await ClientsService.toggleClient(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
