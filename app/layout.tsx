import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Employer Branding Analyse — Convaix',
  description: 'Kostenlose KI-gestützte Analyse Ihres Employer Brandings. Jetzt in 5 Minuten starten.',
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
