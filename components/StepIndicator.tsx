import { TOTAL_STEPS } from '@/lib/types';

interface Props {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: Props) {
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--gray-placeholder)',
          }}
        >
          Schritt {currentStep} von {TOTAL_STEPS}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--gray-placeholder)',
          }}
        >
          {Math.round(progress)}%
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'var(--gray-warm)',
          borderRadius: '100px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: 'var(--primary)',
            borderRadius: '100px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
