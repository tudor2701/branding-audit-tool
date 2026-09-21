# Recruiting Audit Funnel

A lead-generation funnel built for a German employer-branding agency. Visitors from paid LinkedIn/Meta campaigns answer an 8-step questionnaire about how they hire, and a few minutes later receive a personalised, AI-written recruiting analysis in their inbox. The agency gets a qualified lead with full context before the first call.

> **Impact:** ~€40,000 in deal volume attributed to leads from this funnel so far.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## The problem

The agency ran ads that sent traffic to a generic contact form. Conversion was low, and the leads that did come in had no context — every sales call started from zero.

## The solution

Replace "contact us" with something useful: a free, instant analysis of the prospect's hiring situation. It lowers the barrier to convert and hands sales a pre-qualified lead.

```
Ad click → Landing page → 8-step form → POST /api/submit
                                              │
                                              ▼
                                  Automation webhook (Make)
                                              │
              ┌───────────────┬───────────────┼────────────────┐
              ▼               ▼               ▼                ▼
        Google Sheets     Claude API      Email to lead    Email to sales
        (lead log)     (HTML analysis)   (analysis + CTA)  (lead + answers)
                                              │
                                              ▼
                                   /danke → Meta Pixel "Lead" event
```

## Features

- **8-step form wizard** — a single-component state machine with per-step validation and a progress indicator.
- **Validated API route** — `app/api/submit/route.ts` checks required fields and email format, normalises the payload, and adds a timestamp.
- **Fire-and-forget webhook** — the user never waits on the automation. If the webhook fails, it's logged server-side and the user still reaches the thank-you page.
- **LLM analysis with a strict output contract** — the prompt forces clean, email-safe HTML in a fixed structure (key finding → strengths → levers → recommendations → conclusion), capped at 250 words, with at least one point tailored to the prospect's hiring region.
- **Conversion tracking** — Meta Pixel `PageView` on every page, `Lead` event fired on the thank-you page for campaign optimisation. Renders nothing if no pixel ID is set.
- **No database, no auth** — the whole backend is one route plus a webhook. Easy to host, nothing to maintain.
- **Self-hosted fonts** — no runtime dependency on third-party font CDNs.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, CSS variables as design tokens |
| Automation | Make (webhook → Sheets → Claude → Gmail) |
| AI | Anthropic Claude via HTTP |
| Tracking | Meta Pixel |
| Hosting | Vercel |

## Getting started

```bash
git clone https://github.com/tudor2701/branding-audit-tool.git
cd branding-audit-tool
npm install
```

Create `.env.local`:

```dotenv
MAKE_WEBHOOK_URL=https://hook.eu2.make.com/your-webhook-id
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-link
NEXT_PUBLIC_META_PIXEL_ID=            # optional
```

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Project structure

```
app/
  page.tsx              Landing page (hero, benefits, trust logos)
  analyse/page.tsx      Form wizard
  danke/page.tsx        Thank-you page + booking CTA + Lead event
  api/submit/route.ts   Validation + webhook forwarding
components/
  FormWizard.tsx        8-step state machine
  StepIndicator.tsx     Progress bar
  MetaPixel.tsx         Pixel base code
  LeadEvent.tsx         Conversion event on mount
lib/
  types.ts              FormData / SubmitPayload
  make-webhook.ts       fetch wrapper for the webhook
```

## What I'd do next

- Move the lead log from Google Sheets into Postgres so leads can be queried and joined with campaign data.
- Add a server-side Conversions API call next to the browser pixel for more reliable attribution.
