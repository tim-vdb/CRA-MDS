"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
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
import { Loader2, GithubIcon } from "lucide-react";
import { authClient, signIn, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/utils/utils";

const LoginFormSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const isOAuthReturn = searchParams.get("oauth") === "1";
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  function canRedirectOAuthUser(email?: string | null) {
    // Add your custom user condition here (domain, role, allowlist, etc.)
    return Boolean(email);
  }

  function getOAuthReturnUrl() {
    const params = new URLSearchParams({ oauth: "1" });
    if (callbackUrl) {
      params.set("callbackUrl", callbackUrl);
    }
    return `/login?${params.toString()}`;
  }

  useEffect(() => {
    if (!isOAuthReturn || !session?.user) {
      return;
    }

    setGoogleLoading(false);
    setGithubLoading(false);

    if (!canRedirectOAuthUser(session.user.email)) {
      toast.error("Utilisateur OAuth non autorisé");
      return;
    }

    router.push(callbackUrl ?? "/");
    router.refresh();
  }, [isOAuthReturn, session, callbackUrl, router]);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          callbackURL: callbackUrl ?? "/",
        }),
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.message || data?.error || "Une erreur est survenue");
        return;
      }

      toast.success("Connexion réussie");
      router.push(callbackUrl ?? "/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    await signIn.social(
      {
        provider: "google",
        callbackURL: getOAuthReturnUrl(),
      },
      {
        onRequest: () => {
          setGoogleLoading(true);
        },
        onResponse: () => {
          setGoogleLoading(false);
        },
      }
    );
  }

  async function handleGithubSignIn() {
    setGithubLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: getOAuthReturnUrl(),
      });
    } catch {
      toast.error("Erreur lors de la connexion avec GitHub");
      setGithubLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center text-foreground min-h-screen">
      <div className="bg-white dark:bg-white border-4 border-zinc-200 dark:border-zinc-300 rounded-3xl p-10 w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-700 font-inter">
            Connexion
          </p>
          <h2 className="text-4xl leading-tight text-zinc-950 dark:text-zinc-900 mt-1">
            Bienvenue sur CRA Solutions
          </h2>
          <p className="font-inter text-sm text-zinc-600 mt-3">
            Connectez-vous pour accéder à votre espace.
          </p>
        </div>

        {/* Google OAuth */}
        <Button
          variant="outline"
          className={cn("w-full gap-2 mb-4 border-zinc-300 dark:border-zinc-300 text-zinc-800 dark:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-100")}
          disabled={loading || googleLoading}
          onClick={handleGoogleSignIn}
        >
          {
            googleLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
            )
          }
          Sign in with Google
        </Button>

        {isOAuthReturn && session?.user?.email && (
          <p className="mb-4 text-center text-xs text-zinc-600">
            Email connecté: {session.user.email}
          </p>
        )}

        {/* GitHub OAuth */}
        <Button
          type="button"
          variant="outline"
          className={cn("w-full gap-2 mb-6 border-zinc-300 dark:border-zinc-300 text-zinc-800 dark:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-100")}
          onClick={handleGithubSignIn}
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
                      className="rounded-md border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
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
                      className="rounded-md border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="rounded-md text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold"
              disabled={loading || githubLoading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Se connecter"}
            </Button>

            <p className="text-center text-xs text-zinc-500">
              Pas encore de compte ?{" "}
              <Link href="/sign-up" className="underline text-zinc-700">
                Créer un compte
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
