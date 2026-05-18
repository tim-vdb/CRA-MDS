import { UserProfile } from "@/features/Account/components/UserProfile";

export default function AccountPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">My account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal information.
        </p>
      </div>
      <UserProfile />
    </div>
  );
}
