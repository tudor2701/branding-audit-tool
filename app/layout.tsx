import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
