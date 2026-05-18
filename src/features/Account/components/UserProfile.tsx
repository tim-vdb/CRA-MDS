"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Camera, Loader2, Mail, Calendar, Shield } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState, useEffect } from "react"
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
import { ChangeEmailDialog } from "./ChangeEmailDialog"
import { DeleteAccountSection } from "./DeleteAccountSection"

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
})

type UpdateProfileFormValues = z.infer<typeof UpdateProfileSchema>

export function UserProfile() {
  const user = useUser()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image ?? null)
  const [linkedProviders, setLinkedProviders] = useState<Set<string>>(new Set())

  useEffect(() => {
    authClient.listAccounts().then(({ data }) => {
      if (data) setLinkedProviders(new Set(data.map((a) => a.providerId)))
    })
  }, [])

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: { name: user?.name ?? "" },
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
        toast.error(error.message ?? "An error occurred")
        return
      }
      toast.success("Profile updated successfully.")
      router.refresh()
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsPending(false)
    }
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  const formattedCreatedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—"

  const formattedUpdatedDate = user?.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—"

  const githubConnected = linkedProviders.has("github")
  const googleConnected = linkedProviders.has("google")

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Picture & Basic Info Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl">My profile</CardTitle>
          <CardDescription>Manage your personal information and profile picture.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32 ring-4 ring-primary/10">
                  <AvatarImage src={imagePreview ?? undefined} alt="Profile picture" className="object-cover" />
                  <AvatarFallback className="text-2xl font-semibold bg-linear-to-br from-primary to-primary/60 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="photo-upload" className="absolute bottom-0 right-0">
                  <Button variant="default" size="icon" className="h-10 w-10 rounded-full shadow-lg" type="button" asChild>
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
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>PNG, JPG or GIF • Max 5 MB</span>
                </div>
              </div>
            </div>

            <Separator />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} className="rounded-lg h-10" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Email address</label>
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Mail className="h-4 w-4 shrink-0 opacity-60" />
                    <span className="font-medium">{user?.email ?? "—"}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    You cannot directly change your email.{" "}
                    {user?.email ? (
                      <ChangeEmailDialog currentEmail={user.email} />
                    ) : (
                      <span className="opacity-60">Request a change</span>
                    )}
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isPending} className="h-10 px-6 rounded-lg font-medium">
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
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
            Account details
          </CardTitle>
          <CardDescription>Details and status of your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
              <p className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400 tracking-wide">Last updated</p>
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">{formattedUpdatedDate}</p>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
              <p className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400 tracking-wide flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Account created
              </p>
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">{formattedCreatedDate}</p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg">Connected accounts</CardTitle>
          <CardDescription>Manage your social login connections.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* GitHub */}
            <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${githubConnected ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20" : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-950/50"}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  <svg className="h-5 w-5 text-zinc-900 dark:text-zinc-50" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.58 9.58 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">GitHub</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {githubConnected ? `Connected • ${user?.email}` : "Not connected"}
                  </p>
                </div>
              </div>
              {githubConnected ? (
                <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-700 text-xs">
                  ✓ Connected
                </Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4"
                  onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/account" })}
                >
                  Connect
                </Button>
              )}
            </div>

            {/* Google */}
            <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${googleConnected ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20" : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-950/50"}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${googleConnected ? "bg-blue-100 dark:bg-blue-950" : "bg-zinc-100 dark:bg-zinc-900"}`}>
                  <svg className={`h-5 w-5 ${googleConnected ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-400"}`} viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
                    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" />
                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Google</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {googleConnected ? `Connected • ${user?.email}` : "Not connected"}
                  </p>
                </div>
              </div>
              {googleConnected ? (
                <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-700 text-xs">
                  ✓ Connected
                </Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4"
                  onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/account" })}
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountSection userEmail={user?.email ?? ""} />
    </div>
  )
}
