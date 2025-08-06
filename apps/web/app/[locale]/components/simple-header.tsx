'use client';

import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { JolteonLogo } from '@repo/design-system/components/ui/jolteon-logo';
import Link from 'next/link';

export const SimpleHeader = () => {
  return (
    <header className="sticky top-0 left-0 z-40 w-full border-primary border-b-[3px] bg-black">
      <nav className="container mx-auto flex items-center justify-between px-4 py-7 md:px-15">
        <Link href="/" className="flex items-center text-white">
          <JolteonLogo size="md" />
        </Link>
        <div className="flex items-center">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};
