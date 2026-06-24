import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../../../back/lib/api-error";
import * as ClientsService from "../../../back/services/clients.service";

export async function GET() {
  try {
    const clients = await ClientsService.listClients();
    return NextResponse.json(clients);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await ClientsService.createClient(body);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
