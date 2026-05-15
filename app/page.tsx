import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Link from 'next/link';

const BENEFITS = [
  {
    title: '5 Minuten',
    description: 'Schnell und einfach ausfüllen — kein Fachwissen nötig.',
  },
  {
    title: 'KI-Analyse',
    description: 'Personalisierte Auswertung Ihrer Antworten durch künstliche Intelligenz.',
  },
  {
    title: 'Direkt per E-Mail',
    description: 'Ihre Analyse erhalten Sie sofort in Ihrem Postfach.',
  },
];

const PARTNERS = [
  {
    name: 'Trustpilot',
    src: 'https://cdn.prod.website-files.com/66a89c1b08041bb1df8b19ec/66a8b3634ad842ef99d015b9_20240227_CONVAIX_Website_Logo_Trustpilot_4_Stars.webp',
    height: 48,
  },
  {
    name: 'ProvenExpert',
    src: 'https://cdn.prod.website-files.com/66a89c1b08041bb1df8b19ec/66a8b3e5d0512a6556401038_20240221_CONVAIX_Website_Logo_Proven_Expert.svg',
    height: 44,
  },
  {
    name: 'Personio',
    src: 'https://cdn.prod.website-files.com/66a89c1b08041bb1df8b19ec/66a8b4ce8d24ceadcb709bb4_20240730_CONVAIX_Website_Logo_Personio.svg',
    height: 36,
  },
  {
    name: 'Meta Business Partner',
    src: 'https://cdn.prod.website-files.com/66a89c1b08041bb1df8b19ec/66a8b2e383e2f7d4bb751212_20240221_CONVAIX_Website_Logo_Meta.png',
    height: 40,
  },
];

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />

      {/* Benefits Section */}
      <section id="benefits" style={{ padding: '5rem 0', backgroundColor: 'var(--gray-light)', scrollMarginTop: '2rem' }}>
        <div className="container benefits-grid">
          {BENEFITS.map((b) => (
            <div key={b.title} className="card" style={{ padding: '3rem' }}>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {b.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1rem',
                  color: '#525866',
                  lineHeight: 1.65,
                }}
              >
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section
        style={{
          padding: '3.5rem 0',
          backgroundColor: 'var(--white)',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4rem',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter Display', sans-serif",
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--black)',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
            }}
          >
            Unsere Partner
          </span>
          {PARTNERS.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.name}
              src={p.src}
              alt={p.name}
              style={{
                height: `${p.height * 1.5}px`,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '1.75rem 0',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            color: 'var(--gray-medium)',
          }}
        >
          © 2025 Convaix. Alle Rechte vorbehalten.
        </p>
      </footer>
    </main>
  );
}
