import { getUser } from '@/lib/auth-session';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ux/theme-provider';
import { Shell } from './shell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Boilerplate',
  description: '',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-inter antialiased min-h-screen bg-white dark:bg-gray-extra-dark`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
          <Shell user={user}>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
