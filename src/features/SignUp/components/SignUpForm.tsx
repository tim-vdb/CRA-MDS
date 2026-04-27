"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X, GithubIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const SignUpFormSchema = z
  .object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(12, "Minimum 12 caractères"),
    passwordConfirmation: z.string().min(12, "La confirmation est obligatoire"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirmation"],
  });

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubIconLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    setLoading(true);
    try {
      const payload = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        image: image ? await convertImageToBase64(image) : "",
        callbackURL: "/",
      };

      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.message || data?.error || "Une erreur est survenue");
        return;
      }

      toast.success("Compte créé avec succès !");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function handleGithubIconSignIn() {
    setGithubIconLoading(true);
    try {
      await authClient.signIn.social({ provider: "github", callbackURL: "/" });
    } catch {
      toast.error("Erreur lors de la connexion avec GitHub");
      setGithubIconLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center text-foreground min-h-screen py-10">
      <div className="bg-white dark:bg-white border-4 border-zinc-200 dark:border-zinc-300 rounded-3xl p-10 w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-700 font-inter">
            Inscription
          </p>
          <h2 className="text-4xl leading-tight text-zinc-950 dark:text-zinc-900 mt-1">
            Créer votre compte
          </h2>
          <p className="font-inter text-sm text-zinc-600 mt-3">
            Remplissez les champs pour rejoindre CRA Solutions.
          </p>
        </div>

        {/* GitHub OAuth */}
        <Button
          type="button"
          variant="outline"
          className="w-full mb-4 border-zinc-300 text-zinc-800 hover:bg-zinc-50"
          onClick={handleGithubIconSignIn}
          disabled={githubLoading || loading}
        >
          {githubLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GithubIcon className="size-4" />
          )}
          Continuer avec GitHub
        </Button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-zinc-500">ou</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 font-inter">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-800">Prénom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Camille"
                        {...field}
                        className="rounded-md border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-800">Nom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Martin"
                        {...field}
                        className="rounded-md border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemple@mail.com"
                      {...field}
                      className="rounded-md border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="rounded-md border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="rounded-md border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <FormLabel className="text-zinc-800">Photo de profil (optionnel)</FormLabel>
              <div className="flex items-end gap-4">
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-sm overflow-hidden shrink-0">
                    <Image src={imagePreview} alt="Preview" width={64} height={64} className="object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2 w-full">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border-zinc-300 bg-white text-zinc-900 file:text-zinc-800"
                  />
                  {imagePreview && (
                    <X
                      className="cursor-pointer text-zinc-700 shrink-0"
                      onClick={() => { setImage(null); setImagePreview(null); }}
                    />
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="rounded-md text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold"
              disabled={loading || githubLoading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Créer mon compte"}
            </Button>

            <p className="text-center text-xs text-zinc-500">
              Déjà un compte ?{" "}
              <Link href="/login" className="underline text-zinc-700">
                Se connecter
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
