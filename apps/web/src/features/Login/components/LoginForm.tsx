"use client";

import { Button } from "../../../components/ui/button";
import { authClient, signIn } from "../../../lib/auth-client";
import { cn } from "../../../utils/utils";
import { GithubIcon, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  async function handleGoogleSignIn() {
    await signIn.social(
      {
        provider: "google",
        callbackURL: callbackUrl ?? "/",
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
        callbackURL: callbackUrl ?? "/",
      });
    } catch {
      toast.error("Error signing in with GitHub");
      setGithubLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center text-foreground min-h-screen">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-700 dark:text-zinc-400 font-inter">
            Sign in
          </p>
          <h2 className="text-2xl leading-tight text-zinc-950 dark:text-zinc-50 mt-1">
            Welcome to CRA Solutions
          </h2>
          <p className="font-inter text-sm text-zinc-600 dark:text-zinc-400 mt-3">
            Connect to your account to access your dashboard
          </p>
        </div>

        <Button
          variant="outline"
          className={cn(
            "w-full gap-2 mb-4 border-zinc-300 dark:border-zinc-700",
            "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100",
            "hover:bg-zinc-100 dark:hover:bg-zinc-700"
          )}
          disabled={googleLoading}
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

        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full gap-2 mb-6 border-zinc-300 dark:border-zinc-700",
            "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100",
            "hover:bg-zinc-100 dark:hover:bg-zinc-700"
          )}
          onClick={handleGithubSignIn}
          disabled={githubLoading}
        >
          {githubLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GithubIcon className="size-4" />
          )}
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}
