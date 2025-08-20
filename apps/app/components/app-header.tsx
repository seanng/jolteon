'use client';

import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { JolteonLogo } from '@repo/design-system/components/ui/jolteon-logo';
import Link from 'next/link';

export const AppHeader = () => {
  return (
    <header className="sticky top-0 left-0 z-50 w-full border-primary border-b-2 bg-black">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center text-white">
          <JolteonLogo size="sm" />
        </Link>
        <ModeToggle />
      </nav>
    </header>
  );
};
