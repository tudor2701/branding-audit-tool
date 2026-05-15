import Link from 'next/link';

const STATS = [
  { value: '150+', label: 'Kunden' },
  { value: '15.000+', label: 'Bewerbungen' },
  { value: '250+', label: 'Besetzte Stellen' },
];

export default function Hero() {
  return (
    <section
      style={{
        padding: '4rem 0 5rem',
        backgroundColor: 'var(--white)',
        overflow: 'hidden',
      }}
    >
      <div className="container hero-grid">
        {/* Left */}
        <div>
          <h1
            className="hero-h1"
            style={{
              fontWeight: 600,
              marginBottom: '1.5rem',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            Wie stark ist Ihr Personalmarketing?
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.125rem',
              color: '#525866',
              fontWeight: 400,
              marginBottom: '2.25rem',
              lineHeight: 1.65,
              maxWidth: '32rem',
            }}
          >
            Beantworten Sie 8 kurze Fragen und erhalten Sie eine kostenlose,
            KI-gestützte Analyse Ihrer Fachkräftegewinnung — direkt in Ihr Postfach.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
            <Link
              href="/analyse"
              className="btn-primary"
              style={{ fontSize: '1rem', padding: '0.875rem 1.75rem' }}
            >
              Analyse starten →
            </Link>
            <a
              href="#benefits"
              className="btn-secondary"
              style={{ fontSize: '1rem', padding: '0.875rem 1.75rem' }}
            >
              Mehr erfahren
            </a>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  className="hero-stat-value"
                  style={{
                    fontFamily: "'Inter Display', sans-serif",
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    color: 'var(--black)',
                  }}
                >
                  {s.value.replace('+', '')}
                  <span style={{ color: 'var(--primary)' }}>+</span>
                </div>
                <div
                  className="hero-stat-label"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: '#525866',
                    marginTop: '0.25rem',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: photo + yellow block + floating card */}
        <div className="hero-photo">
          <div
            style={{
              position: 'absolute',
              top: '22%',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'var(--primary)',
              borderRadius: '1.25em',
              zIndex: 0,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.prod.website-files.com/66a89c1b08041bb1df8b19ec/67d9b147aaf44cf0de49397a_5c48c03d6c6d41138b4e480c70cc92a5_20250318_Phillip_Weber_Hero_Header_v4.webp"
            alt="Philipp Weber — Convaix"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              zIndex: 1,
            }}
          />

        </div>
      </div>
    </section>
  );
}
