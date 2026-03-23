'use client';

import FooterNavbar from '@/features/Navbar/Public/Desktop/FooterNavbar';
import SocialMedia from '@/features/SocialMedia/SocialMedia';
import { cn } from '../../utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <footer className={cn("shadow-md bg-white text-gray-800 py-10 dark:bg-neutral-900 dark:text-gray-200", isAdmin ? "px-4" : "md:px-20 lg:px-20 xl:px-20")}>
      <div className="container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-20 [&_h3]:mt-5">
        <div className="flex flex-col justify-center items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Image
                width={100}
                height={100}
                src="/images/cassetete.svg"
                alt="Logo"
                className="w-16 h-16"
                quality={100}
              />
              <p className="text-xl font-bold">Boilerplate - Inc.</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Voluptatem laboriosam quam enim ut ipsa exercitationem? Natus?
            </p>
          </div>
          <SocialMedia />
        </div>

        <FooterNavbar />
      </div>

      {/* Copyright */}
      <div className="flex flex-col-reverse justify-between items-center gap-4 px-4 border-t border-neutral-500 mt-10 pt-6 text-center md:px-0 md:gap-0 md:flex-row">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          © {year} Boilerplate - All rights reserved.
        </p>
        <div className="flex items-center gap-8">
          <Link
            href="/privacy-policy"
            className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 hover:dark:text-white hover:underline transition"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 hover:dark:text-white hover:underline transition"
          >
            Terms of Service
          </Link>
          <Link
            href="/cookie-policy"
            className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 hover:dark:text-white hover:underline transition"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
