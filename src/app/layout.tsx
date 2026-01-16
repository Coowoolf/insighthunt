import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InsightHunt - Hunt the Insights from the Best Product Minds',
  description: '300+ product methodologies from the world\'s best PMs, extracted from Lenny\'s Podcast. Discover frameworks from Marty Cagan, Shreyas Doshi, Julie Zhuo, and more.',
  keywords: ['product management', 'PM', 'methodology', 'framework', 'Lenny Podcast', 'product strategy'],
  openGraph: {
    title: 'InsightHunt - Hunt the Insights',
    description: '300+ product methodologies from Lenny\'s Podcast',
    url: 'https://insighthunt.org',
    siteName: 'InsightHunt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InsightHunt - Hunt the Insights',
    description: '300+ product methodologies from Lenny\'s Podcast',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
