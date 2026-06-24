import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../../../back/lib/api-error";
import { getUser } from "../../../lib/auth-session";
import { prisma } from "../../../lib/prisma";
 
// GET /api/cras?month=M&year=Y
// Returns all active clients with their activities + invoices for the period.
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
 
    const { searchParams } = req.nextUrl;
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));
 
    if (!month || !year || isNaN(month) || isNaN(year)) {
      return NextResponse.json(
        { error: "Les paramètres month et year sont requis" },
        { status: 400 }
      );
    }
 
    const clients = await prisma.clients.findMany({
      where: { userId: user.id, isActive: true },
      select: {
        id: true,
        name: true,
        dailyRate: true,
        maxDays: true,
        activities: {
          where: { month, year },
          select: {
            id: true,
            date: true,
            daysWorked: true,
            invoices: {
              select: {
                id: true,
                amountHT: true,
                amountTTC: true,
                tvaRate: true,
                status: true,
                number: true,
                issuedAt: true,
              },
            },
          },
          orderBy: { date: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
 
    return NextResponse.json(clients);
  } catch (e) {
    return handleApiError(e);
  }
}