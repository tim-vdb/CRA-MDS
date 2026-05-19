'use server';

import { auth } from '../../../lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function LogoutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  console.log('Déconnexion réussie');
  redirect('/login');
}
