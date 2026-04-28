import { ActivityChart } from "@/features/Dashboard/components/ActivityChart"
import ActivityGrid from "@/features/Dashboard/components/ActivityGrid"
import { getActivities } from "@/features/Dashboard/server/activity";

export default async function HomePage() {
  const today = new Date();
  const month = today.getMonth() + 1; // 1-12
  const year = today.getFullYear();

  const activities = await getActivities(month, year);
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Comptes Rendus d'Activité</h1>
      </div>
      <div className="space-y-6">
        <ActivityChart />
        <ActivityGrid
      initialActivities={activities}
      initialMonth={month}
      initialYear={year}
    />
      </div>
    </div>
  )
}
