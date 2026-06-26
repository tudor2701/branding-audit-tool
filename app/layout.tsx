import type { Metadata } from 'next';
import './globals.css';
import MetaPixel from '@/components/MetaPixel';

export const metadata: Metadata = {
  title: 'Personalmarketing-Analyse | Convaix',
  description: 'Kostenlose Analyse Ihres Personalmarketings. Jetzt in 5 Minuten starten.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
