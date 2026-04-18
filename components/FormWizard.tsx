'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from './StepIndicator';
import LoadingState from './LoadingState';
import { FormData, FormAnswer, TOTAL_STEPS } from '@/lib/types';

const ZIELGRUPPE_OPTIONS = [
  'Fachkräfte',
  'Führungskräfte',
  'Auszubildende',
  'Alle Zielgruppen',
  'Andere',
];

const KANAL_OPTIONS = [
  'LinkedIn',
  'Instagram',
  'Facebook',
  'Karrierewebsite',
  'Xing',
  'Kununu',
  'Keine',
];

const STEP_TITLES: Record<number, string> = {
  1: 'Ihre Kontaktdaten',
  2: 'Zielgruppe',
  3: 'Ihre Marke',
  4: 'Differenzierung',
  5: 'Aktive Kanäle',
  6: 'Branding-Konsistenz',
  7: 'Ihr größtes Problem',
  8: 'Ihr Ziel',
};

export default function FormWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [zielgruppe, setZielgruppe] = useState('');
  const [marke, setMarke] = useState('');
  const [differenzierung, setDifferenzierung] = useState('');
  const [kanaele, setKanaele] = useState<string[]>([]);
  const [konsistenz, setKonsistenz] = useState(3);
  const [problem, setProblem] = useState('');
  const [ziel, setZiel] = useState('');

  function isStepValid(): boolean {
    switch (currentStep) {
      case 1:
        return name.trim() !== '' && email.trim() !== '' && company.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      case 2:
        return zielgruppe !== '';
      case 3:
        return marke.trim() !== '';
      case 4:
        return differenzierung.trim() !== '';
      case 5:
        return kanaele.length > 0;
      case 6:
        return true;
      case 7:
        return problem.trim() !== '';
      case 8:
        return ziel.trim() !== '';
      default:
        return false;
    }
  }

  function toggleKanal(kanal: string) {
    setKanaele((prev) =>
      prev.includes(kanal) ? prev.filter((k) => k !== kanal) : [...prev, kanal]
    );
  }

  function handleNext() {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => (s + 1) as typeof currentStep);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((s) => (s - 1) as typeof currentStep);
    }
  }

  async function handleSubmit() {
    if (!isStepValid()) return;
    setIsSubmitting(true);
    setError('');

    const answers: FormAnswer[] = [
      { question: 'Zielgruppe', answer: zielgruppe },
      { question: 'Marke in 3 Worten', answer: marke },
      { question: 'Differenzierung von Wettbewerbern', answer: differenzierung },
      { question: 'Aktive Kanäle', answer: kanaele.join(', ') },
      { question: 'Branding-Konsistenz (1-5)', answer: String(konsistenz) },
      { question: 'Größtes Branding-Problem', answer: problem },
      { question: 'Ziel in 6 Monaten', answer: ziel },
    ];

    const formData: FormData = { name, email, phone, company, answers };

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ein Fehler ist aufgetreten.');
      }
      router.push('/danke');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.');
      setIsSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    minHeight: '56px',
    padding: '0.75rem 1rem',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '1rem',
    color: 'var(--black)',
    background: 'transparent',
    outline: 'none',
  };

  return (
    <>
      {isSubmitting && <LoadingState />}
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '3rem 2.5rem',
        }}
      >
        <StepIndicator currentStep={currentStep} />

        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 600,
            marginBottom: '2rem',
            fontFamily: "'Inter Display', sans-serif",
            letterSpacing: '-0.01em',
          }}
        >
          {STEP_TITLES[currentStep]}
        </h2>

        {/* Step 1: Contact */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input
                type="text"
                placeholder="Max Mustermann"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>E-Mail-Adresse *</label>
              <input
                type="email"
                placeholder="max@musterfirma.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Telefonnummer (optional)</label>
              <input
                type="tel"
                placeholder="+49 123 456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Firmenname *</label>
              <input
                type="text"
                placeholder="Musterfirma GmbH"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {/* Step 2: Zielgruppe */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={questionStyle}>Wen wollen Sie mit Ihrem Employer Branding erreichen?</p>
            {ZIELGRUPPE_OPTIONS.map((opt) => (
              <label key={opt} style={radioLabelStyle(zielgruppe === opt)}>
                <input
                  type="radio"
                  name="zielgruppe"
                  value={opt}
                  checked={zielgruppe === opt}
                  onChange={() => setZielgruppe(opt)}
                  style={{ display: 'none' }}
                />
                <span style={radioIndicatorStyle(zielgruppe === opt)} />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* Step 3: Marke */}
        {currentStep === 3 && (
          <div>
            <p style={questionStyle}>Beschreiben Sie Ihre Marke in 3 Worten</p>
            <input
              type="text"
              placeholder="z.B. innovativ, zuverlässig, menschlich"
              value={marke}
              onChange={(e) => setMarke(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        {/* Step 4: Differenzierung */}
        {currentStep === 4 && (
          <div>
            <p style={questionStyle}>Was unterscheidet Sie von Ihren Wettbewerbern?</p>
            <textarea
              placeholder="Beschreiben Sie Ihre einzigartigen Stärken und Alleinstellungsmerkmale als Arbeitgeber…"
              value={differenzierung}
              onChange={(e) => setDifferenzierung(e.target.value)}
              rows={5}
              style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
            />
          </div>
        )}

        {/* Step 5: Kanäle */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={questionStyle}>Auf welchen Kanälen sind Sie aktiv? (Mehrfachauswahl)</p>
            {KANAL_OPTIONS.map((opt) => (
              <label key={opt} style={checkboxLabelStyle(kanaele.includes(opt))}>
                <input
                  type="checkbox"
                  value={opt}
                  checked={kanaele.includes(opt)}
                  onChange={() => toggleKanal(opt)}
                  style={{ display: 'none' }}
                />
                <span style={checkboxIndicatorStyle(kanaele.includes(opt))} />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* Step 6: Konsistenz */}
        {currentStep === 6 && (
          <div>
            <p style={questionStyle}>Wie einheitlich ist Ihr Branding über alle Kanäle?</p>
            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--gray-placeholder)' }}>Uneinheitlich</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--gray-placeholder)' }}>Sehr konsistent</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={konsistenz}
                onChange={(e) => setKonsistenz(Number(e.target.value))}
                style={{
                  width: '100%',
                  appearance: 'none',
                  height: '4px',
                  borderRadius: '100px',
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((konsistenz - 1) / 4) * 100}%, var(--gray-warm) ${((konsistenz - 1) / 4) * 100}%, var(--gray-warm) 100%)`,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: konsistenz === n ? 600 : 400,
                      color: konsistenz === n ? 'var(--black)' : 'var(--gray-placeholder)',
                    }}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--gray-light)',
                  borderRadius: '12px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                }}
              >
                Ihr Wert: <strong style={{ color: 'var(--black)' }}>{konsistenz} / 5</strong>
                {konsistenz <= 2 && ' — Noch viel Potenzial'}
                {konsistenz === 3 && ' — Solide Basis'}
                {konsistenz >= 4 && ' — Sehr gut aufgestellt'}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Problem */}
        {currentStep === 7 && (
          <div>
            <p style={questionStyle}>Was ist Ihr aktuell größtes Branding-Problem?</p>
            <textarea
              placeholder="Beschreiben Sie die Herausforderungen, mit denen Sie aktuell im Bereich Employer Branding konfrontiert sind…"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={5}
              style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
            />
          </div>
        )}

        {/* Step 8: Ziel */}
        {currentStep === 8 && (
          <div>
            <p style={questionStyle}>Was möchten Sie in den nächsten 6 Monaten erreicht haben?</p>
            <textarea
              placeholder="Beschreiben Sie Ihre konkreten Ziele und Erwartungen für die nächsten 6 Monate…"
              value={ziel}
              onChange={(e) => setZiel(e.target.value)}
              rows={5}
              style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
            />
          </div>
        )}

        {error && (
          <p
            style={{
              marginTop: '1rem',
              color: '#ea384c',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
            }}
          >
            {error}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: currentStep === 1 ? 'flex-end' : 'space-between',
            alignItems: 'center',
            marginTop: '2.5rem',
            gap: '1rem',
          }}
        >
          {currentStep > 1 && (
            <button onClick={handleBack} className="btn-secondary">
              ← Zurück
            </button>
          )}
          {currentStep < TOTAL_STEPS ? (
            <button
              onClick={handleNext}
              className="btn-primary"
              disabled={!isStepValid()}
            >
              Weiter →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-primary"
              disabled={!isStepValid() || isSubmitting}
            >
              Analyse anfordern →
            </button>
          )}
        </div>
      </div>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Inter', sans-serif",
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--black)',
  marginBottom: '0.375rem',
};

const questionStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '1rem',
  fontWeight: 400,
  color: 'var(--black)',
  marginBottom: '1.25rem',
  lineHeight: 1.6,
};

function radioLabelStyle(selected: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    border: `1px solid ${selected ? 'var(--primary)' : 'var(--border-color)'}`,
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--black)',
    backgroundColor: selected ? 'rgba(252, 201, 0, 0.08)' : 'transparent',
    transition: 'border-color 0.2s, background-color 0.2s',
  };
}

function checkboxLabelStyle(checked: boolean): React.CSSProperties {
  return radioLabelStyle(checked);
}

function radioIndicatorStyle(selected: boolean): React.CSSProperties {
  return {
    flexShrink: 0,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: `2px solid ${selected ? 'var(--primary)' : 'var(--gray-medium)'}`,
    backgroundColor: selected ? 'var(--primary)' : 'transparent',
    transition: 'border-color 0.2s, background-color 0.2s',
  };
}

function checkboxIndicatorStyle(checked: boolean): React.CSSProperties {
  return {
    flexShrink: 0,
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: `2px solid ${checked ? 'var(--primary)' : 'var(--gray-medium)'}`,
    backgroundColor: checked ? 'var(--primary)' : 'transparent',
    transition: 'border-color 0.2s, background-color 0.2s',
  };
}
