import { ActivityCalendar } from "@/features/Dashboard/components/ActivityCalendar";


export default function ActivitiesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Comptes Rendus d'Activité</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sélectionnez une date pour voir les activités associées
        </p>
      </div>
      <ActivityCalendar />
    </div>
  )
}