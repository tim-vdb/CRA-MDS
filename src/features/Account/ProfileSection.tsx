// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { Camera, Loader2, Mail } from "lucide-react"
// import { useForm } from "react-hook-form"
// import { toast } from "sonner"
// import { useState } from "react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Separator } from "@/components/ui/separator"
// import { useUser } from "@/context/UserContext"
// import { useUpdateUser } from "@/hooks/querys/use-users"
// import { UpdateProfileSchema, type UpdateProfileFormValues } from "@/types/profile.schema"
// import { VerifyEmailChangeModal } from "./VerifyEmailChangeModal"

// export function ProfileSection() {
//     const user = useUser()
//     const { mutate: updateUser, isPending } = useUpdateUser()
//     const [showEmailModal, setShowEmailModal] = useState(false)

//     const form = useForm<UpdateProfileFormValues>({
//         resolver: zodResolver(UpdateProfileSchema),
//         defaultValues: {
//             firstname: user?.firstname ?? "",
//             lastname: user?.lastname ?? "",
//             username: user?.username ?? "",
//             phone: user?.phone ?? "",
//         },
//     })

//     function onSubmit(values: UpdateProfileFormValues) {
//         if (!user?.id) return

//         updateUser(
//             { id: user.id, data: values },
//             {
//                 onSuccess: () => {
//                     toast.success("Profil mis à jour avec succès.")
//                 },
//                 onError: (error) => {
//                     toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
//                 },
//             }
//         )
//     }

//     const initials = [user?.firstname?.[0], user?.lastname?.[0]].filter(Boolean).join("").toUpperCase() || "?"

//     return (
//         <div className="flex flex-col gap-6">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Informations du profil</CardTitle>
//                     <CardDescription>
//                         Mettez à jour vos informations personnelles et votre photo de profil.
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="flex flex-col gap-6">
//                         {/* Avatar */}
//                         <div className="flex items-center gap-4">
//                             <Avatar className="size-20">
//                                 <AvatarImage src={user?.image ?? ""} alt="Photo de profil" />
//                                 <AvatarFallback className="text-lg bg-primary/10 text-primary">
//                                     {initials}
//                                 </AvatarFallback>
//                             </Avatar>
//                             <div className="flex flex-col gap-2">
//                                 <Button variant="outline" size="sm" type="button">
//                                     <Camera className="size-4" />
//                                     Changer la photo
//                                 </Button>
//                                 <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Max 2MB.</p>
//                             </div>
//                         </div>

//                         <Separator />

//                         {/* Form */}
//                         <Form {...form}>
//                             <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
//                                 <div className="grid gap-4 sm:grid-cols-2">
//                                     <FormField
//                                         control={form.control}
//                                         name="firstname"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Prénom</FormLabel>
//                                                 <FormControl>
//                                                     <Input placeholder="Non spécifié" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                     <FormField
//                                         control={form.control}
//                                         name="lastname"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Nom</FormLabel>
//                                                 <FormControl>
//                                                     <Input placeholder="Non spécifié" {...field} />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </div>

//                                 <FormField
//                                     control={form.control}
//                                     name="username"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Nom d'utilisateur</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="@username" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <div className="space-y-2">
//                                     <FormLabel>Email</FormLabel>
//                                     <div className="flex gap-2">
//                                         <div className="flex-1 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
//                                             {user?.email}
//                                         </div>
//                                         <Button
//                                             type="button"
//                                             variant="outline"
//                                             size="sm"
//                                             onClick={() => setShowEmailModal(true)}
//                                         >
//                                             <Mail className="size-4" />
//                                             Changer
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 <FormField
//                                     control={form.control}
//                                     name="phone"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Téléphone</FormLabel>
//                                             <FormControl>
//                                                 <Input type="tel" placeholder="Non spécifié" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <Separator />

//                                 {/* Account Info */}
//                                 <div className="grid gap-4 sm:grid-cols-2 text-sm">
//                                     <div>
//                                         <p className="text-muted-foreground">Rôle</p>
//                                         <p className="font-medium">{user?.role ?? "—"}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-muted-foreground">Statut</p>
//                                         <Badge variant="secondary">Membre</Badge>
//                                     </div>
//                                     <div>
//                                         <p className="text-muted-foreground">Inscription</p>
//                                         <p className="font-medium">
//                                             {user?.createdAt
//                                                 ? new Date(user.createdAt).toLocaleDateString("fr-FR")
//                                                 : "—"}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-muted-foreground">Dernière modification</p>
//                                         <p className="font-medium">
//                                             {user?.updatedAt
//                                                 ? new Date(user.updatedAt).toLocaleDateString("fr-FR")
//                                                 : "—"}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="flex justify-end">
//                                     <Button type="submit" disabled={isPending}>
//                                         {isPending && <Loader2 className="size-4 animate-spin" />}
//                                         Enregistrer les modifications
//                                     </Button>
//                                 </div>
//                             </form>
//                         </Form>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Email Change Modal */}
//             <VerifyEmailChangeModal
//                 open={showEmailModal}
//                 onOpenChange={setShowEmailModal}
//                 currentEmail={user?.email ?? ""}
//             />
//         </div>
//     )
// }
