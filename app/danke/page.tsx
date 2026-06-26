import Link from 'next/link';
import LeadEvent from '@/components/LeadEvent';

export default function DankePage() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '#';

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--white)',
      }}
    >
      <LeadEvent />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://cdn.prod.website-files.com/66a89c1b08041bb1df8b19ec/66a8a014431d2a5f339734f2_convaix-logo-schwarz.svg"
        alt="Convaix"
        width={148}
        style={{ width: '148px', marginBottom: '3rem' }}
      />

      <div style={{ maxWidth: '540px' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Vielen Dank!</h1>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.0625rem',
            color: 'var(--gray-placeholder)',
            lineHeight: 1.7,
            marginBottom: '3rem',
          }}
        >
          Ihre Antworten wurden erfolgreich übermittelt. Sie erhalten Ihre
          persönliche Personalmarketing-Analyse in Kürze per E-Mail.
        </p>

        <div
          style={{
            backgroundColor: 'var(--gray-light)',
            borderRadius: '1em',
            padding: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter Display', sans-serif",
              fontSize: '1rem',
              fontWeight: 500,
              color: 'var(--black)',
              marginBottom: '0.5rem',
            }}
          >
            Bereit für den nächsten Schritt?
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9375rem',
              color: 'var(--gray-placeholder)',
              lineHeight: 1.6,
            }}
          >
            Buchen Sie jetzt ein kostenloses Erstgespräch mit unserem Team.
            Wir haben Ihre Analyse bereits vorliegen und können sofort loslegen.
          </p>
        </div>

        <Link
          href={calendlyUrl}
          className="btn-primary"
          style={{ fontSize: '1.0625rem', padding: '0.875rem 2rem' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Jetzt kostenloses Erstgespräch buchen
        </Link>
      </div>
    </main>
  );
}
