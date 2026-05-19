'use client';

import { cn } from '../../../../utils/utils';
import { FilePenLine, Folder, LogOut, Newspaper, UserCog } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function DashboardNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const linksClasses = {
    base: 'flex items-center gap-2 px-3 py-2 w-fit md:w-full rounded-lg text-sm font-medium transition-all duration-200 font-cooper',
    isActive:
      'bg-blue-100 dark:bg-neutral-800 text-blue-600 dark:text-yellow-400 underline decoration-2 decoration-blue-500 dark:decoration-yellow-600',
    notActive:
      'text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-blue-500 dark:hover:text-yellow-400',
  };

  return (
    <nav className="">
      <div className="flex justify-center md:items-start md:justify-start gap-8 w-full h-full pt-4 md:pt-20">
        <Link
          href="/admin/gallery"
          className={cn(
            linksClasses.base,
            isActive('/admin/gallery')
              ? linksClasses.isActive
              : linksClasses.notActive
          )}
        >
          <Folder className="text-blue-600 dark:text-blue-600" />
          <p className="hidden md:block">Galerie</p>
        </Link>
        <Link
          href="/admin/events"
          className={cn(
            linksClasses.base,
            isActive('/admin/events')
              ? linksClasses.isActive
              : linksClasses.notActive
          )}
        >
          <Newspaper className="text-blue-600 dark:text-blue-600" />
          <p className="hidden md:block">Gérer les événements</p>
        </Link>
        <Link
          href="/admin/users"
          className={cn(
            linksClasses.base,
            isActive('/admin/users')
              ? linksClasses.isActive
              : linksClasses.notActive
          )}
        >
          <UserCog className="text-blue-600 dark:text-blue-600" />
          <p className="hidden md:block">Gérer les utilisateurs</p>
        </Link>
        <Link
          href="/admin/blog/create"
          className={cn(
            linksClasses.base,
            isActive('/admin/blog/create')
              ? linksClasses.isActive
              : linksClasses.notActive
          )}
        >
          <FilePenLine className="text-blue-600 dark:text-blue-600" />
          <p className="hidden md:block">Créer un article</p>
        </Link>
        <Link
          href="/"
          className={cn(
            linksClasses.base,
            isActive('/') ? linksClasses.isActive : linksClasses.notActive
          )}
        >
          <LogOut className="text-blue-600 dark:text-blue-600" />

          <p className="hidden md:block">Quitter</p>
        </Link>
      </div>
    </nav>
  );
}
