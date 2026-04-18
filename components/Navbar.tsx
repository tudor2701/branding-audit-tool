import Link from 'next/link';

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--white)',
        zIndex: 9999,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          paddingBottom: '1rem',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.prod.website-files.com/66a89c1b08041bb1df8b19ec/66a8a014431d2a5f339734f2_convaix-logo-schwarz.svg"
            alt="Convaix"
            width={148}
            height="auto"
            style={{ width: '148px', height: 'auto' }}
          />
        </Link>
        <Link href="/analyse" className="btn-primary" style={{ fontSize: '0.9375rem' }}>
          Analyse starten
        </Link>
      </div>
    </nav>
  );
}
