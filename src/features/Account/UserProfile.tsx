"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Camera, Loader2, GithubIcon, Mail, Calendar, Shield } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/context/UserContext"
import { authClient } from "@/lib/auth-client"

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
})

type UpdateProfileFormValues = z.infer<typeof UpdateProfileSchema>

export function UserProfile() {
  const user = useUser()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image ?? null)

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  })

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function onSubmit(values: UpdateProfileFormValues) {
    setIsPending(true)
    try {
      const { error } = await authClient.updateUser({
        name: values.name,
        ...(imagePreview && imagePreview !== user?.image ? { image: imagePreview } : {}),
      })
      if (error) {
        toast.error(error.message ?? "Une erreur est survenue")
        return
      }
      toast.success("Profil mis à jour avec succès.")
      router.refresh()
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setIsPending(false)
    }
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  const formattedCreatedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    : "—"

  const formattedUpdatedDate = user?.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    : "—"

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Picture & Basic Info Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl">Mon profil</CardTitle>
          <CardDescription>Gérez vos informations personnelles et votre photo de profil.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32 ring-4 ring-primary/10">
                  <AvatarImage src={imagePreview ?? undefined} alt="Photo de profil" className="object-cover" />
                  <AvatarFallback className="text-2xl font-semibold bg-linear-to-br from-primary to-primary/60 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="photo-upload" className="absolute bottom-0 right-0">
                  <Button
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full shadow-lg"
                    type="button"
                    asChild
                  >
                    <span className="cursor-pointer">
                      <Camera className="h-5 w-5" />
                    </span>
                  </Button>
                </label>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{user?.name ?? "—"}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1 mt-1">
                    <Mail className="h-4 w-4" />
                    {user?.email ?? "—"}
                  </p>
                </div>

                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>PNG, JPG ou GIF • Max 5 MB</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Form Section */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Nom complet</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrez votre nom complet"
                          {...field}
                          className="rounded-lg h-10"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Email read-only */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Adresse email</label>
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Mail className="h-4 w-4 shrink-0 opacity-60" />
                    <span className="font-medium">{user?.email ?? "—"}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Vous ne pouvez pas modifier directement votre email. <a href="#" className="underline hover:text-zinc-700">Demander un changement</a>
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-10 px-6 rounded-lg font-medium"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Enregistrement...
                      </>
                    ) : (
                      "Enregistrer les modifications"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      {/* Account Details Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Informations du compte
          </CardTitle>
          <CardDescription>Détails et statut de votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
              <p className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400 tracking-wide">Statut de vérification</p>
              <Badge
                variant={user?.emailVerified ? "default" : "secondary"}
                className="w-fit text-xs font-medium"
              >
                {user?.emailVerified ? "✓ Email vérifié" : "⚠ Non vérifié"}
              </Badge>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
              <p className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400 tracking-wide">Rôle</p>
              <Badge variant="outline" className="w-fit text-xs font-medium">
                Membre
              </Badge>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
              <p className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400 tracking-wide flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Compte créé
              </p>
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">{formattedCreatedDate}</p>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
              <p className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400 tracking-wide">Dernière modification</p>
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">{formattedUpdatedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg">Comptes connectés</CardTitle>
          <CardDescription>Gérez vos connexions via les réseaux sociaux.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  <GithubIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
                </div>
                <div>
                  <p className="font-medium text-sm">GitHub</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Connectez votre compte GitHub</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-9 px-4">
                Connecter
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors bg-zinc-50/50 dark:bg-zinc-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Google</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Connecté • {user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-9 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                Déconnecter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
