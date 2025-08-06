import Link from 'next/link';

export const SimpleFooter = () => (
  <footer className="mt-24 border-t">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Jolteon. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link
            href="/legal/privacy"
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="/legal/terms"
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            Terms
          </Link>
        </nav>
      </div>
    </div>
  </footer>
);
