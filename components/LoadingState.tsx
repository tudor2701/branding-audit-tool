export default function LoadingState() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: '3px solid var(--gray-warm)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '1.5rem',
        }}
      />
      <p
        style={{
          fontFamily: "'Inter Display', sans-serif",
          fontSize: '1.125rem',
          fontWeight: 500,
          color: 'var(--black)',
          letterSpacing: '-0.01em',
        }}
      >
        Ihre Analyse wird vorbereitet…
      </p>
    </div>
  );
}
