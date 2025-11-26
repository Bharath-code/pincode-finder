import type { Metadata, Viewport } from 'next';
import { Archivo_Black, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { WebVitals } from '@/components/WebVitals';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from "@vercel/analytics/next"

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pincode Finder India - Locate Post Offices & Pincodes',
  description: 'Instantly find All India Pincodes and Post Office details. Search by pincode, branch name, or use GPS to locate your nearest post office. Fast, accurate, and works offline.',
  keywords: 'pincode finder, india post, post office search, zip code india, postal code india, find pincode, locate post office, gps pincode',
  openGraph: {
    title: 'Pincode Finder India - Locate Post Offices & Pincodes',
    description: 'Instantly find All India Pincodes and Post Office details. Search by pincode, branch name, or use GPS to locate your nearest post office. Fast, accurate, and works offline.',
    url: 'https://pincodefinder.com', // Replace with actual domain
    siteName: 'Pincode Finder India',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pincode Finder India - Locate Post Offices & Pincodes',
    description: 'Instantly find All India Pincodes and Post Office details. Search by pincode, branch name, or use GPS to locate your nearest post office. Fast, accurate, and works offline.',
  },
  // themeColor: '#E62020', // Moved to viewport
};

// New export for viewport metadata
export const viewport: Viewport = {
  themeColor: '#E62020',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ibmPlexSans.variable} ${archivoBlack.variable}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <WebVitals />
          <Analytics/>
          <Suspense fallback={<div>Loading app...</div>}> {/* Wrap with Suspense */}
            {children}
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
