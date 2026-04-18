# Convaix Branding Audit Tool

Standalone Next.js Lead-Gen-Tool für **Convaix** (Employer Branding Agentur, convaix.de). 8-Schritt-Fragebogen → POST an Make Webhook → Make erledigt Google Sheets + Claude API Analyse + Gmail-Versand.

Client-Kontakt: Philipp Weber
Ziel: Ad-Landing-Page für LinkedIn/Meta Kampagnen, verlinkt von convaix.de.

## Tech Stack

- Next.js 14 (App Router), TypeScript strict
- Tailwind CSS v4
- Self-hosted Fonts (Inter Display + Inter) in `/public/fonts/`
- Keine DB, keine Auth, keine Claude SDK im Next.js (Make macht alles)
- Fire-and-forget Webhook Pattern

## Commands

```bash
npm run dev       # localhost:3002 (port 3000 belegt von anderem Projekt)
npm run build     # production build
npm run lint
```

## Architektur

```
User → Landing / → /analyse (8-Step Form) → POST /api/submit
                                                  ↓
                                         Make Webhook
                                            ↓
                          Google Sheets + Claude API + Gmail (User) + Gmail (Philipp)
                                                  ↓
                                              /danke
```

## Env Vars (`.env.local`)

```
MAKE_WEBHOOK_URL=https://hook.eu2.make.com/...
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/...
```

## Design Tokens

```
--primary: #fcc900     Gelb — CTAs, Highlights
--black: #0e0e0e       Text
--gray-light: #f8f8f8  Section-BG
--gray-placeholder: #868c98
--border-color: #e2e4e9

Fonts: Inter Display (Headings) + Inter (Body) — self-hosted .otf in /public/fonts/
h1: 4.25rem, weight 600, letter-spacing -0.02em
Container: max-width 80rem, padding 0 2.5rem
Button pill: border-radius 100px, bg #fcc900, hover → black
```

## File Map

```
app/
  layout.tsx           Root + Font-Faces
  globals.css          CSS-Variablen, @font-face, .btn-primary, .card, .container
  page.tsx             Landing (Hero + Benefits + Partner)
  analyse/page.tsx     Form Wizard
  danke/page.tsx       Thank-You + Calendly CTA
  api/submit/route.ts  Validate + POST an Make
components/
  Navbar.tsx           Logo + "Analyse starten" Button
  Hero.tsx             Hero mit Philipp + gelbem Viereck
  FormWizard.tsx       8-Step State Machine
  StepIndicator.tsx    Progress bar
  LoadingState.tsx     Spinner beim Submit
lib/
  types.ts             FormData, SubmitPayload Interfaces
  make-webhook.ts      fetch() Wrapper
```

## Form Steps

1. Kontakt — Name*, E-Mail*, Telefon, Firma*
2. Zielgruppe (Radio)
3. Marke in 3 Worten (Text)
4. Differenzierung (Textarea)
5. Kanäle (Multi-Checkbox)
6. Konsistenz (Slider 1–5)
7. Größtes Branding-Problem (Textarea)
8. Ziel in 6 Monaten (Textarea)

## Submit Payload (an Make)

```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "company": "...",
  "submittedAt": "2026-04-18T10:00:00Z",
  "answers": [{ "question": "...", "answer": "..." }]
}
```

---

## Next Steps

### 1. Make Scenario aufsetzen

- [ ] Neues Szenario in Make
- [ ] **Module 1: Webhook** — Custom Webhook, URL kopieren → in `.env.local` als `MAKE_WEBHOOK_URL` eintragen, dev server neu starten
- [ ] Testsubmit aus Form → Make "Determine data structure" triggert → JSON-Schema wird gelernt
- [ ] **Module 2: Google Sheets "Add a Row"** — Spalten: Timestamp, Name, Email, Phone, Firma, jede Antwort als eigene Spalte. Sheet vorher anlegen.
- [ ] **Module 3: HTTP "Make a request"** — POST `https://api.anthropic.com/v1/messages`
  - Header: `x-api-key: <ANTHROPIC_API_KEY>`, `anthropic-version: 2023-06-01`, `content-type: application/json`
  - Body JSON:
    ```json
    {
      "model": "claude-sonnet-4-6",
      "max_tokens": 2000,
      "system": "Du bist Employer Branding Experte bei Convaix. Stil: direkt, professionell, lösungsorientiert. Antworte auf Deutsch mit: Zusammenfassung (2-3 Sätze), 3 Stärken, 3-5 Potenziale mit Priorität (hoch/mittel/niedrig), 3 konkrete Empfehlungen mit Zeitrahmen und erwarteter Wirkung, abschließendes Fazit.",
      "messages": [{"role": "user", "content": "Firma: {{company}}\n\nAntworten:\n{{answers}}"}]
    }
    ```
  - Parse Response: Text aus `content[0].text`
- [ ] **Module 4: Gmail "Send Email"** → User
  - To: `{{email}}`
  - Subject: `Ihre Employer Branding Analyse — Convaix`
  - Body HTML: formatierte Analyse aus Claude Response (Markdown → HTML via Make Text Parser oder Hand-Formatierung)
- [ ] **Module 5: Gmail "Send Email"** → Philipp
  - To: Philipps Adresse
  - Subject: `Neuer Lead: {{company}}`
  - Body: alle Kontaktdaten + Antworten + Claude-Analyse
- [ ] Szenario aktivieren, End-to-End-Test

### 2. Deployment

- [ ] Vercel-Projekt anlegen, Repo (oder Folder) deployen
- [ ] Env Vars in Vercel Dashboard setzen: `MAKE_WEBHOOK_URL`, `NEXT_PUBLIC_CALENDLY_URL`
- [ ] Custom Domain `check.convaix.de` → DNS CNAME auf Vercel
- [ ] SSL verifizieren, Live-Test

### 3. Optional / Später

- [ ] Calendly-URL von Philipp bekommen + einsetzen
- [ ] Philipps echte Email-Adresse für Lead-Notifications einsetzen
- [ ] Tracking einbauen (Meta Pixel / LinkedIn Insight Tag für Ad-Conversion)
- [ ] Mobile-Responsiveness finalen Check auf echten Devices
- [ ] DSGVO: Cookie-Banner prüfen, Impressum/Datenschutz-Links im Footer

---

## Known Issues / Design Notes

- **Philipps Photo**: WebP von convaix.de CDN, hat weißen Hintergrund (nicht transparent). Aktuell einfach mit `objectFit: contain` + `objectPosition: bottom center` über gelbem CSS-Viereck. Wirkt wie auf convaix.de.
- **Dev-Port**: 3002 (3000 belegt, 3001 belegt)
- **Fonts**: Komplett self-hosted, Webflow CDN nur für initialen Download verwendet. Keine Laufzeit-Abhängigkeit.
