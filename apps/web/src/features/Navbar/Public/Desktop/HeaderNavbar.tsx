'use client';

import { cn } from '../../../../utils/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function DesktopNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const linksClasses = {
    base: 'px-3 py-2 rounded-md text-sm font-medium transition-colors font-cooper',
    isActive:
      'underline decoration-2 decoration-blue-500 dark:decoration-yellow-600 text-black dark:text-white',
    notActive: 'text-black dark:text-gray-300',
  };

  return (
    <nav className="container flex items-center justify-center gap-4 h-full w-full">
      {/* Navigation Desktop */}
      <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-4">
          <Link
            href="/features"
            className={cn(
              linksClasses.base,
              isActive('/features')
                ? linksClasses.isActive
                : linksClasses.notActive
            )}
          >
            Features
          </Link>
          <Link
            href="/solution"
            className={cn(
              linksClasses.base,
              isActive('/solution')
                ? linksClasses.isActive
                : linksClasses.notActive
            )}
          >
            Solution
          </Link>
          <Link
            href="/pricing"
            className={cn(
              linksClasses.base,
              isActive('/pricing')
                ? linksClasses.isActive
                : linksClasses.notActive
            )}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className={cn(
              linksClasses.base,
              isActive('/about')
                ? linksClasses.isActive
                : linksClasses.notActive
            )}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={cn(
              linksClasses.base,
              isActive('/contact')
                ? linksClasses.isActive
                : linksClasses.notActive
            )}
          >
            Contact Us
          </Link>
          <Link
            href="/team"
            className={cn(
              linksClasses.base,
              isActive('/team') ? linksClasses.isActive : linksClasses.notActive
            )}
          >
            Our Team
          </Link>
          <Link
            href="/Docs"
            className={cn(
              linksClasses.base,
              isActive('/Docs') ? linksClasses.isActive : linksClasses.notActive
            )}
          >
            Docs
          </Link>
          <Link
            href="/blog"
            className={cn(
              linksClasses.base,
              isActive('/blog') ? linksClasses.isActive : linksClasses.notActive
            )}
          >
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}
