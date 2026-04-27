import { UserProfile } from "@/features/Account/UserProfile"

export default function AccountPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Mon compte</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez vos informations personnelles.</p>
      </div>
      <UserProfile />
    </div>
  )
}
