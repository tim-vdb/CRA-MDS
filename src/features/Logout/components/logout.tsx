'use client';

import { LogoutAction } from '../server/logout.action';
import { useTransition } from 'react';

export default function LogOut() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await LogoutAction();
    });
  }

  return (
    <form action={LogoutAction} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="cursor-pointer w-full text-left py-1.5 px-2"
        disabled={isPending}
      >
        {isPending ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    </form>
  );
}
