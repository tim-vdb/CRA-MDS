import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../../../../back/lib/api-error";
import * as ActivitiesService from "../../../../back/services/activities.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));
    const clientId = searchParams.get("clientId") ?? undefined;

    if (!month || !year || isNaN(month) || isNaN(year)) {
      return NextResponse.json(
        { error: "Les paramètres month et year sont requis" },
        { status: 400 }
      );
    }

    const data = await ActivitiesService.getChartData(month, year, clientId);
    return NextResponse.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
