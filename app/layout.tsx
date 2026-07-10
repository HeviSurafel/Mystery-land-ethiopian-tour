// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mystery Land Tours | Discover Hidden Wonders',
  description: 'Adventure begins where the ordinary ends. Experience curated journeys to the world\'s most exclusive and untouched locations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} bg-background text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed`}>
        {children}
      </body>
    </html>
  );
}