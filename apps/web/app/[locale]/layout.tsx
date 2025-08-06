import './styles.css';
// import { Toolbar as CMSToolbar } from '@repo/cms/components/toolbar';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
// import { Toolbar } from '@repo/feature-flags/components/toolbar';
import { getDictionary } from '@repo/internationalization';
import type { ReactNode } from 'react';
// import { Footer } from './components/footer';
import { SimpleFooter } from './components/simple-footer';
// import { Header } from './components/header';
import { SimpleHeader } from './components/simple-header';

type RootLayoutProperties = {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
};

const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <html
      lang="en"
      className={cn(fonts, 'scroll-smooth')}
      suppressHydrationWarning
    >
      <head>
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
      </head>
      <body>
        <DesignSystemProvider>
          <SimpleHeader />
          {children}
          <SimpleFooter />
        </DesignSystemProvider>
        {/* <Toolbar /> */}
        {/* <CMSToolbar /> */}
      </body>
    </html>
  );
};

export default RootLayout;
