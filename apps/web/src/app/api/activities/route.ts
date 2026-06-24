import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../../../back/lib/api-error";
import * as ActivitiesService from "../../../back/services/activities.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year || isNaN(month) || isNaN(year)) {
      return NextResponse.json(
        { error: "Les paramètres month et year sont requis" },
        { status: 400 }
      );
    }

    const data = await ActivitiesService.getActivities(month, year);
    return NextResponse.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { clientId: string; date: string; daysWorked: number };
    const { clientId, date, daysWorked } = body;

    if (!clientId || !date || daysWorked === undefined) {
      return NextResponse.json(
        { error: "Les champs clientId, date et daysWorked sont requis" },
        { status: 400 }
      );
    }

    await ActivitiesService.upsertActivity(clientId, new Date(date), daysWorked);
    return NextResponse.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
