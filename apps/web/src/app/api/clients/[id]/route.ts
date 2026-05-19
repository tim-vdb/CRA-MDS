import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../../../../back/lib/api-error";
import * as ClientsService from "../../../../back/services/clients.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const client = await ClientsService.getClient(id);
    return NextResponse.json(client);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    await ClientsService.updateClient(id, body);
    return NextResponse.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await ClientsService.deleteClient(id);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return handleApiError(e);
  }
}
