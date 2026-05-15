'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from './StepIndicator';
import LoadingState from './LoadingState';
import { FormData, FormAnswer, TOTAL_STEPS } from '@/lib/types';

const ZIELGRUPPE_OPTIONS = [
  'Fachkräfte',
  'Auszubildende',
  'Führungskräfte',
  'Helfer & Quereinsteiger',
  'Verschiedene Gruppen',
];

const WERBUNG_OPTIONS = [
  'Ja, regelmäßig',
  'Manchmal',
  'Nein, noch nie',
];

const STELLEN_KANAL_OPTIONS = [
  'Eigene Karriereseite',
  'Indeed',
  'Stepstone',
  'Agentur für Arbeit',
  'LinkedIn',
  'Facebook',
  'Instagram',
  'Xing',
  'Kununu',
  'Wir veröffentlichen aktuell keine',
];

const SOCIAL_OPTIONS = [
  'Instagram',
  'Facebook',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'Xing',
  'Kununu',
  'Keine',
];

const BEWERBUNGEN_OPTIONS = [
  'Keine',
  '1–5 pro Monat',
  '6–15 pro Monat',
  '16–50 pro Monat',
  'Mehr als 50 pro Monat',
];

const STEP_TITLES: Record<number, string> = {
  1: 'Ihre Kontaktdaten',
  2: 'Wen suchen Sie?',
  3: 'Stellen-Werbung',
  4: 'Stellenanzeigen',
  5: 'Social Media',
  6: 'Bewerbungen',
  7: 'Ihre Herausforderung',
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
  const [werbung, setWerbung] = useState('');
  const [stellenKanaele, setStellenKanaele] = useState<string[]>([]);
  const [socialKanaele, setSocialKanaele] = useState<string[]>([]);
  const [bewerbungen, setBewerbungen] = useState('');
  const [problem, setProblem] = useState('');
  const [ziel, setZiel] = useState('');

  function isStepValid(): boolean {
    switch (currentStep) {
      case 1:
        return name.trim() !== '' && email.trim() !== '' && company.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      case 2:
        return zielgruppe !== '';
      case 3:
        return werbung !== '';
      case 4:
        return stellenKanaele.length > 0;
      case 5:
        return socialKanaele.length > 0;
      case 6:
        return bewerbungen !== '';
      case 7:
        return problem.trim() !== '';
      case 8:
        return ziel.trim() !== '';
      default:
        return false;
    }
  }

  function toggleStellenKanal(k: string) {
    setStellenKanaele((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  }

  function toggleSocialKanal(k: string) {
    setSocialKanaele((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
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
      { question: 'Welche Mitarbeiter suchen Sie aktuell?', answer: zielgruppe },
      { question: 'Schalten Sie Werbung für Ihre offenen Stellen?', answer: werbung },
      { question: 'Wo veröffentlichen Sie Ihre Stellenanzeigen?', answer: stellenKanaele.join(', ') },
      { question: 'Auf welchen Social-Media-Kanälen ist Ihr Unternehmen aktiv?', answer: socialKanaele.join(', ') },
      { question: 'Wie viele Bewerbungen erhalten Sie aktuell pro Monat?', answer: bewerbungen },
      { question: 'Größte Herausforderung bei der Personalsuche', answer: problem },
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
      <div className="form-wizard">
        <StepIndicator currentStep={currentStep} />

        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 600,
            marginBottom: '2rem',
            fontFamily: "'Inter Display', sans-serif",
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
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
            <p style={questionStyle}>Welche Mitarbeiter suchen Sie aktuell?</p>
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

        {/* Step 3: Werbung */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={questionStyle}>
              Schalten Sie Werbung für Ihre offenen Stellen (z.B. bezahlte Anzeigen auf Facebook,
              Instagram, Google oder Stellenportalen)?
            </p>
            {WERBUNG_OPTIONS.map((opt) => (
              <label key={opt} style={radioLabelStyle(werbung === opt)}>
                <input
                  type="radio"
                  name="werbung"
                  value={opt}
                  checked={werbung === opt}
                  onChange={() => setWerbung(opt)}
                  style={{ display: 'none' }}
                />
                <span style={radioIndicatorStyle(werbung === opt)} />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* Step 4: Stellen-Kanäle */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={questionStyle}>
              Wo veröffentlichen Sie Ihre Stellenanzeigen aktuell? (Mehrfachauswahl möglich)
            </p>
            {STELLEN_KANAL_OPTIONS.map((opt) => (
              <label key={opt} style={checkboxLabelStyle(stellenKanaele.includes(opt))}>
                <input
                  type="checkbox"
                  value={opt}
                  checked={stellenKanaele.includes(opt)}
                  onChange={() => toggleStellenKanal(opt)}
                  style={{ display: 'none' }}
                />
                <span style={checkboxIndicatorStyle(stellenKanaele.includes(opt))} />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* Step 5: Social Media */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={questionStyle}>
              Auf welchen Social-Media-Kanälen ist Ihr Unternehmen aktiv? (Mehrfachauswahl möglich)
            </p>
            {SOCIAL_OPTIONS.map((opt) => (
              <label key={opt} style={checkboxLabelStyle(socialKanaele.includes(opt))}>
                <input
                  type="checkbox"
                  value={opt}
                  checked={socialKanaele.includes(opt)}
                  onChange={() => toggleSocialKanal(opt)}
                  style={{ display: 'none' }}
                />
                <span style={checkboxIndicatorStyle(socialKanaele.includes(opt))} />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* Step 6: Bewerbungen */}
        {currentStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={questionStyle}>Wie viele Bewerbungen erhalten Sie aktuell pro Monat?</p>
            {BEWERBUNGEN_OPTIONS.map((opt) => (
              <label key={opt} style={radioLabelStyle(bewerbungen === opt)}>
                <input
                  type="radio"
                  name="bewerbungen"
                  value={opt}
                  checked={bewerbungen === opt}
                  onChange={() => setBewerbungen(opt)}
                  style={{ display: 'none' }}
                />
                <span style={radioIndicatorStyle(bewerbungen === opt)} />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* Step 7: Problem */}
        {currentStep === 7 && (
          <div>
            <p style={questionStyle}>Was ist Ihre größte Herausforderung bei der Personalsuche?</p>
            <textarea
              placeholder="z.B. zu wenige Bewerbungen, schlechte Qualität der Bewerber, Stellen bleiben lange unbesetzt…"
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
            <p style={questionStyle}>Was möchten Sie in den nächsten 6 Monaten erreichen?</p>
            <textarea
              placeholder="z.B. 5 neue Mitarbeiter einstellen, bestimmte Position besetzen, deutlich mehr Bewerbungen erhalten…"
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
            flexWrap: 'wrap',
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
