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
2. Welche Mitarbeiter suchen Sie? (Radio: Fachkräfte / Azubis / Führungskräfte / Helfer / Verschiedene)
3. Schalten Sie Werbung? (Radio: Ja regelmäßig / Manchmal / Nein)
4. Wo veröffentlichen Sie Stellenanzeigen? (Multi-Checkbox: Karriereseite, Indeed, Stepstone, LinkedIn, …)
5. In welcher Region suchen Sie Mitarbeiter? (Textfeld — PLZ/Stadt; Claude nutzt das für Wettbewerbs-Recherche)
6. Bewerbungen pro Monat (Radio: Keine / 1–5 / 6–15 / 16–50 / 50+)
7. Größte Herausforderung bei der Personalsuche (Textarea)
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
- [ ] **Module 2: Google Sheets "Add a Row"** — Sheet vorher anlegen. Make-Arrays sind **1-basiert** (nicht 0). Spalten-Mapping:

    | Spalte | Header | Mapping |
    |--------|--------|---------|
    | A | Timestamp | `submittedAt` |
    | B | Name | `name` |
    | C | Email | `email` |
    | D | Telefon | `phone` |
    | E | Firma | `company` |
    | F | Zielgruppe | `answers[1].answer` |
    | G | Werbung | `answers[2].answer` |
    | H | Stellen-Kanäle | `answers[3].answer` |
    | I | Region | `answers[4].answer` |
    | J | Bewerbungen | `answers[5].answer` |
    | K | Problem | `answers[6].answer` |
    | L | Ziel | `answers[7].answer` |
- [ ] **Module 3: HTTP "Make a request"** — POST `https://api.anthropic.com/v1/messages`
  - Header: `x-api-key: <ANTHROPIC_API_KEY>`, `anthropic-version: 2023-06-01`, `content-type: application/json`
  - Body Type: **Data structure** (Make escaped Reserved Chars automatisch — verhindert JSON-Bruch bei Newlines in User-Input)
  - Model: `claude-sonnet-4-6`, `max_tokens: 2500`
  - **System Prompt** (exakt so eintragen, echte Enter statt `\n`):

    ```
    Du bist Personalmarketing- und Recruiting-Experte bei Convaix. Schreibe eine professionelle, lösungsorientierte E-Mail-Analyse auf Deutsch in sauberem HTML.

    REGELN:
    - Gib NUR HTML aus, beginnend direkt mit der ersten Section. KEINE Anrede, KEIN Titel — die Mail-Wrapper-Schicht macht das schon.
    - KEINE Markdown-Syntax, KEINE ```html-Codeblöcke, KEINE <html>/<body>-Tags.
    - Erlaubte Tags: <p>, <ul>, <ol>, <li>, <strong>. KEINE <h1>-<h6>, KEINE <hr>, KEINE <br>.
    - Section-Headings als <p><strong>...</strong></p> (gleiche Schriftgröße wie Body, nur fett).
    - Fazit-Section: GENAU EIN <p>-Absatz nach dem Heading — eine einzige Synthese-Aussage. KEINE weiteren Absätze, keinen CONVAIX-Pitch, keine Gesprächs-Einladung — das macht der Wrapper.
    - Aufzählungen: <ul> für ungeordnete, <ol> für nummerierte Listen. Jeder <li> = max 1 Satz, beginnt mit <strong>Titel</strong>: gefolgt vom Erklärungssatz.
    - **MAX 250 Wörter gesamt.** Scannable in unter 60 Sekunden. Keine Wiederholungen, keine Floskeln, keine Erklärungen des Offensichtlichen.
    - KEINE Signatur, KEIN Calendly-Button — Gmail und Make hängen beides automatisch an.

    REGIONALER KONTEXT:
    - Die User-Message enthält das Feld „In welcher Region suchen Sie Mitarbeiter?". Nutze diese Region in den Sections „Größte Hebel" und „Empfehlungen": Mindestens EIN Punkt MUSS regionalen Wettbewerbsdruck oder einen lokalen Differenzierungs-Hebel adressieren (z.B. Pendel-Radius, lokale Sichtbarkeit, regionale Stellenportale/Kanäle, Konkurrenz vor Ort um die genannte Zielgruppe).
    - KEINE erfundenen Zahlen, KEINE Statistik-Behauptungen — nur plausibler Marktkontext, der für jede deutsche Region einer ähnlichen Größe gelten würde.
    - Falls die Region unspezifisch ist (z.B. „bundesweit", „egal"), keinen regionalen Punkt erzwingen — dann normale Empfehlungen.

    STRUKTUR (exakt einhalten, {{company}} aus User-Message übernehmen):
    <p><strong>Kernbefund</strong></p>
    <p>...1-2 Sätze: was ist der zentrale Engpass im Recruiting...</p>
    <p><strong>Stärken</strong></p>
    <ul><li><strong>Titel</strong>: max 1 Satz</li>...2-3 Punkte...</ul>
    <p><strong>Größte Hebel</strong></p>
    <ul><li><strong>Titel</strong>: max 1 Satz</li>...2-3 Punkte...</ul>
    <p><strong>Empfehlungen</strong></p>
    <ol><li><strong>Titel</strong>: max 1 Satz, konkret</li>...3 Punkte...</ol>
    <p><strong>Fazit</strong></p>
    <p>...EIN Satz Synthese: was ist der entscheidende Hebel, warum ist das Ziel realistisch...</p>
    ```

    Wichtig: KEIN CONVAIX-Pitch und KEINE Gesprächs-Einladung im Output — Make-Wrapper hängt das mit fixem Text separat an (siehe Module 4).

  - **User Message:** `Firma: {{company}}\nName: {{name}}\n\nAntworten:\n{{answers}}`
  - Parse Response: Output = `{{3.content[0].text}}` (ist bereits sauberes HTML)

- [ ] **Gmail Signatur** — Settings → Signature → HTML-Signatur (Logo, Philipp, Kontakt) hinterlegen. In Gmail-Modulen `Send signature: Yes` setzen. Kein Code-Anhängen nötig.

- [ ] **Module 4: Gmail "Send Email"** → Kunde
  - To: `{{email}}`
  - Subject: `Ihre Recruiting-Analyse für {{company}} — Convaix`
  - **Content type: HTML**
  - Body (Anrede-Wrapper + Claude-Output + statische Schluss-Sätze + CTA + Outro, **KEINE `<hr>`-Tags**):
    ```html
    <p>Hallo {{name}},</p>
    <p>vielen Dank für Ihre Anfrage. Basierend auf Ihren Angaben haben wir eine erste Recruiting-Analyse für {{company}} erstellt:</p>
    {{3.content[0].text}}
    <p>Genau hier setzt <strong>CONVAIX</strong> an: mit einer datengetriebenen, kanalübergreifenden Recruiting-Strategie, die Ihre Arbeitgebermarke gezielt in Bewerbungen verwandelt.</p>
    <p>Lassen Sie uns in einem kostenlosen 20-minütigen Gespräch konkret durchgehen, welche Hebel in Ihrem Fall den schnellsten Impact liefern.</p>
    <p style="text-align:center;margin:40px 0 32px;">
      <a href="CALENDLY_URL_HIER" style="background:#fcc900;color:#0e0e0e;padding:16px 36px;border-radius:100px;text-decoration:none;font-weight:600;font-family:Arial,sans-serif;font-size:16px;display:inline-block;">Jetzt Termin vereinbaren</a>
    </p>
    <p style="text-align:center;color:#868c98;font-family:Arial,sans-serif;font-size:13px;margin:0;">20 Minuten · kostenlos · unverbindlich</p>
    <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
    ```
    `CALENDLY_URL_HIER` durch echte Calendly-URL (Philipp) ersetzen. Wrapper sagt **Recruiting-Analyse**, nicht „Employer Branding". Keine `<hr>`-Striche im Body — Gmail-Signatur (via `Send signature: Yes`) trennt sich selbst durch ihren eigenen `--`-Block. CONVAIX-Pitch und Gesprächs-Einladung kommen aus dem Wrapper (nicht aus Claude), damit Fazit-Sektion gleiches Rhythmus-Muster wie alle anderen Sektionen hat.
  - `Send signature: Yes`

- [ ] **Module 5: Gmail "Send Email"** → Philipp
  - To: Philipps Adresse
  - Subject: `Neuer Lead: {{company}} ({{name}})`
  - Content type: HTML
  - Body: Lead-Daten-Block (Name, Mail, Tel, Firma, alle Antworten) + Trennlinie + `{{3.content[0].text}}`
  - `Send signature: Yes` (optional)

- [ ] End-to-End-Test: Testsubmit → HTML rendert sauber in Gmail? Anrede korrekt? Signatur dran? Keine rohen Markdown-Zeichen?

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

---

## Änderungsprotokoll

### 2026-05-20 — Call mit Philipp: Region statt Social Media

**Hintergrund:** Convaix kümmert sich nicht um Social-Media-Profile / LinkedIn. Die alte Step-5-Frage „Auf welchen Social-Media-Kanälen ist Ihr Unternehmen aktiv?" lieferte keinen Mehrwert für die Analyse. Stattdessen jetzt Region-Abfrage für regionale Wettbewerbs-Recherche durch Claude.

**Was sich änderte:**

- **`components/FormWizard.tsx`**
  - State: `socialKanaele: string[]` → `region: string`
  - `SOCIAL_OPTIONS` Array entfernt, `toggleSocialKanal` Handler entfernt
  - `STEP_TITLES[5]`: `'Social Media'` → `'Region'`
  - Step-5 Render: Multi-Checkbox-Liste → einzelnes Textfeld (Placeholder „z.B. Stuttgart, PLZ 70…, Großraum München")
  - `isStepValid` case 5: `socialKanaele.length > 0` → `region.trim() !== ''`
  - `handleSubmit` answers[3]: `{ question: 'Auf welchen Social-Media-Kanälen…', answer: socialKanaele.join(', ') }` → `{ question: 'In welcher Region suchen Sie Mitarbeiter?', answer: region }`
- **`CLAUDE.md`** (diese Datei)
  - Form Steps Section auf aktuelle Recruiting-Fragen aktualisiert (war noch alte Branding-Liste)
  - Module-2-Sheet-Mapping als Tabelle dokumentiert, mit Hinweis auf Make 1-basiertes Indexing
  - Module-3-System-Prompt um neuen Block `REGIONALER KONTEXT` ergänzt (zwingt Claude, mindestens einen Punkt mit regionalem Bezug in „Größte Hebel" oder „Empfehlungen" zu liefern)
- **`lib/types.ts` / `components/StepIndicator.tsx`** — keine Änderung (generisch)
- **`app/api/submit/route.ts`** — keine Änderung (Payload bleibt `{ name, email, phone, company, answers[] }`)

**Make-Aufgaben (manuell, kein Code):**

- Webhook „Redetermine data structure" durch Test-Submit neu triggern (Reihenfolge in `answers[]` hat sich nicht geändert, aber Frage-Text in `answers[4]` ist anders → Empfehlung trotzdem)
- Sheet-Header umbenennen: G `Marke` → `Werbung`, H `Differenzierung` → `Stellen-Kanäle`, I `Kanäle` → `Region`, J `Konsistenz` → `Bewerbungen`. Mapping (`answers[1]…[7]`) bleibt unverändert.
- HTTP-Claude-Modul: System-Prompt durch neue Version (mit `REGIONALER KONTEXT`-Block) ersetzen.
