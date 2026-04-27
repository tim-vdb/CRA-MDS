'use client';

import { LogOut as LogOutIcon } from 'lucide-react';
import { LogoutAction } from '../server/logout.action';
import { useTransition } from 'react';

export default function LogOut() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(async () => {
        await LogoutAction();
      })}
      disabled={isPending}
      className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
    >
      <LogOutIcon className="h-4 w-4" />
      <span>{isPending ? 'Déconnexion...' : 'Se déconnecter'}</span>
    </button>
  );
}
