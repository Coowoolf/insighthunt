import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'InsightHunt - Hunt the Insights from the Best Product Minds',
  description: '689 product methodologies from the world\'s best PMs, extracted from Lenny\'s Podcast. Discover frameworks from Marty Cagan, Shreyas Doshi, Julie Zhuo, and more.',
  keywords: ['product management', 'PM', 'methodology', 'framework', 'Lenny Podcast', 'product strategy'],
  openGraph: {
    title: 'InsightHunt - Hunt the Insights',
    description: '689 product methodologies from Lenny\'s Podcast',
    url: 'https://insighthunt.org',
    siteName: 'InsightHunt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InsightHunt - Hunt the Insights',
    description: '689 product methodologies from Lenny\'s Podcast',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

