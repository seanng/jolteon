import { env } from '@/env';
import './styles.css';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';
import { AppHeader } from '../components/app-header';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&family=Kanit:wght@300;400;500;600;700;800;900&family=Maven+Pro:wght@300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <body>
      <DesignSystemProvider
        privacyUrl={new URL(
          '/legal/privacy',
          env.NEXT_PUBLIC_WEB_URL
        ).toString()}
        termsUrl={new URL('/legal/terms', env.NEXT_PUBLIC_WEB_URL).toString()}
        helpUrl={env.NEXT_PUBLIC_DOCS_URL}
      >
        <AppHeader />
        {children}
      </DesignSystemProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
