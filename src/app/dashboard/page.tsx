import { ActivityCalendar } from "@/features/Dashboard/components/ActivityCalendar";
import { ActivityChart } from "@/features/Dashboard/components/ActivityChart";


export default function ActivitiesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Comptes Rendus d'Activité</h1>
      </div>

      <div className="space-y-6">
        <ActivityChart />
        <ActivityCalendar />
      </div>
    </div>
  )
}