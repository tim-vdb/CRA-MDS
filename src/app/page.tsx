import { ActivityChart } from "@/features/Dashboard/components/ActivityChart";
import ActivityGrid from "@/features/Dashboard/components/ActivityGrid/ActivityGrid";
import { ActivityRefreshProvider } from "@/features/Dashboard/context/ActivityRefreshContext";
import { getActivities } from "@/features/Dashboard/server/activity";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const clientsCount = await prisma.clients.count({
    where: { userId: user.id },
  });

  if (clientsCount === 0) {
    redirect("/clients?onboarding=1");
  }

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const activities = await getActivities(month, year);
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Comptes Rendus d&apos;Activité</h1>
      </div>
      <ActivityRefreshProvider>
        <div className="space-y-6">
          <ActivityGrid
            initialActivities={activities}
            initialMonth={month}
            initialYear={year}
          />
          <ActivityChart />
        </div>
      </ActivityRefreshProvider>
    </div>
  );
}
