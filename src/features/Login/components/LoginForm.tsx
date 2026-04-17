"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/utils/utils";

const LoginFormSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "The password must contain at least 6 characters."),
});

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password, callbackURL: callbackUrl ?? '/' }),
        credentials: 'include',
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = data?.message || data?.error || 'Une erreur est survenue';
        toast.error(message);
        return;
      }

      toast.success('Utilisateur connecté');
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center text-foreground h-[calc(100svh-5rem)]">
        <div className="bg-white dark:bg-white border-4 border-zinc-200 dark:border-zinc-300 rounded-3xl p-10 w-full max-w-md shadow-lg">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-700 dark:text-zinc-700 font-inter">
              Login
            </p>
            <h2 className="text-4xl leading-tight text-zinc-950 dark:text-zinc-900">
              Welcome back to CRA Solutions
            </h2>
            <p className="font-inter text-sm text-zinc-600 dark:text-zinc-600 mt-3">
              Log in to access your account.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 font-inter"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-800 dark:text-zinc-900">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@mail.com"
                        {...field}
                        className="rounded-md border-zinc-300 dark:border-zinc-300 bg-white dark:bg-zinc-50 text-zinc-900 dark:text-zinc-900 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 px-3 py-2 focus:outline-none"
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
                    <FormLabel className="text-zinc-800 dark:text-zinc-900">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="rounded-md border-zinc-300 dark:border-zinc-300 bg-white dark:bg-zinc-50 text-zinc-900 dark:text-zinc-900 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 px-3 py-2 focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-zinc-600 dark:text-zinc-700 underline">
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                className="rounded-md dark:bg-background text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold transition"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "log in"
                )}
              </Button>

              <CardFooter>
                <div className="flex justify-center w-full py-4">
                  <p className="text-center text-xs text-zinc-500 dark:text-zinc-600">
                    <Link href="/sign-up" className="underline">
                      <span>
                        Need an account?
                      </span>
                    </Link>
                  </p>
                </div>
              </CardFooter>

            </form>
          </Form>
        </div>
      </div>

    </>
  );
}
