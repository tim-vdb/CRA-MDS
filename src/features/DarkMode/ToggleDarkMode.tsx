'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { usePathname } from 'next/navigation';

export function ToggleDarkMode({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isConnected = pathname.startsWith('/account') || pathname.startsWith('/admin') || pathname.startsWith('/community');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("cursor-pointer ring-0! w-full flex justify-start items-center p-2", className)}
      onClick={toggleTheme}
      suppressHydrationWarning
    >
      <span className="sr-only">Toggle theme</span>
      <div className='flex items-center gap-2'>

        <Sun className="w-4 h-4 block rotate-0 transition-all dark:hidden dark:-rotate-90" />
        <Moon className="w-4 h-4 hidden rotate-90 transition-all dark:block dark:rotate-0" />
        <span className="items_sidebar truncate">
          Theme
        </span>
      </div>
    </Button>
  );
}
