import { getUser } from "../../lib/auth-session";
import { ActivitiesRepository } from "../repositories/activities.repository";

export async function getActivities(month: number, year: number) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return ActivitiesRepository.findByMonthYear(user.id, month, year);
}

export async function upsertActivity(clientId: string, date: Date, daysWorked: number) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const owner = await ActivitiesRepository.findClientOwner(clientId);
  if (!owner) throw new Error("NOT_FOUND");
  if (owner.userId !== user.id) throw new Error("FORBIDDEN");

  return ActivitiesRepository.upsertActivityRecord(clientId, date, daysWorked);
}

export async function getChartData(month: number, year: number, clientId?: string) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  if (clientId) {
    const owner = await ActivitiesRepository.findClientOwner(clientId);
    if (!owner) throw new Error("NOT_FOUND");
    if (owner.userId !== user.id) throw new Error("FORBIDDEN");
  }

  return ActivitiesRepository.findForChart(user.id, month, year, clientId);
}
