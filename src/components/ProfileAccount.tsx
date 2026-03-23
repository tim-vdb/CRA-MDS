'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import LogOut from '@/features/Logout/components/logout';
import { User2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useUser } from '../utils/context/UserContext';
import { formatDate } from '../utils/utils';
import { useMounted } from '../utils/hooks/use-mounted';

export default function ProfileAccount() {
  const mounted = useMounted();
  const user = useUser();
  const pathname = usePathname();
  const userName = user?.name || '';
  const [firstName, ...lastNameParts] = userName.trim().split(' ');
  const lastName = lastNameParts.join(' ');

  // Rendu initial pour éviter l'hydration mismatch
  if (!mounted) {
    return (
      <div className="w-8 h-5">
        {/* Placeholder pour éviter le layout shift */}
      </div>
    );
  }

  return (
    <>
      {userName ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <User2 size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="cursor-pointer">
              <div className="flex items-center gap-2">
                {firstName[0].toUpperCase() + '. ' + lastName}
                {user?.image && (
                  <Image
                    src={user?.image}
                    width={25}
                    height={25}
                    alt="Profile Picture"
                    className="rounded-full"
                  />
                )}
              </div>
              <p className="mt-2 text-xs text-neutral-500">{user?.email}</p>
              <p className="mt-2 text-xs text-neutral-500">
                {user?.createdAt ? formatDate(user.createdAt) : ''}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {user?.role === 'ADMIN' && (
              <DropdownMenuItem className="cursor-pointer">
                <Link href={'/admin'}>Dashboard</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer p-0"
              onSelect={(e) => e.preventDefault()}
            >
              <LogOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          {pathname !== '/login' && (
            <Button variant={'default'} asChild>
              <Link href="/login" className="truncate">
                Connexion
              </Link>
            </Button>
          )}
          {pathname === '/login' && (
            <Button variant={'default'} className="" asChild>
              <Link href="/sign-up" className="truncate">
                Inscription
              </Link>
            </Button>
          )}
        </>
      )}
    </>
  );
}
