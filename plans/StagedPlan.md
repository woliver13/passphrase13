# Plan: Password & Passphrase Generator

> Source PRD: docs/Prd.md (v1.0, 2026-05-12)

## Architectural decisions

Durable decisions that apply across all phases:

- **Framework**: Next.js 14+ App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Rendering**: Fully static / client-side — no backend, no API routes
- **Routes**: Single tool page at `/`; supporting pages (`/privacy`) as needed
- **Randomness**: `crypto.getRandomValues()` (Web Crypto API) exclusively — no `Math.random()`
- **Wordlist**: EFF Long Wordlist (~7776 words) embedded as a TypeScript constant
- **Key models**:
  - `GeneratorMode`: `'password' | 'passphrase'`
  - `PasswordOptions`: length, charset flags (upper, lower, numbers, symbols), ambiguous exclusion, custom chars
  - `PassphraseOptions`: wordCount, separator, capitalize, appendNumber, appendSymbol
- **Strength scoring**: zxcvbn (or equivalent) for crack-time estimate + raw entropy bits
- **Hosting**: TBD — decision deferred to Phase 4; keep the build fully static to preserve all options

---

## Phase 1: Scaffold + Working Generator

**User stories**:
- As a user, I can generate a password/passphrase instantly without signing up.
- As a privacy-conscious user, I can verify everything happens locally.

### What to build

Bootstrap the Next.js project with TypeScript, Tailwind, and shadcn/ui. Implement both generation engines — random password and EFF passphrase — using `crypto.getRandomValues()`, wired to hardcoded defaults (password: 16 chars, all charsets; passphrase: 6 words, hyphen separator). Render the generated output in a large monospace display with a Regenerate button and copy-to-clipboard with visual confirmation. No options UI yet — the tool is already functional end-to-end and demoable.

### Acceptance criteria

- [ ] `next dev` runs with no errors; project deploys to Vercel
- [ ] Password generator produces a 16-character random string using only `crypto.getRandomValues()`
- [ ] Passphrase generator produces a 6-word phrase drawn from the embedded EFF wordlist
- [ ] Generated output renders in a large monospace display
- [ ] Regenerate button produces a new output on every click
- [ ] Copy to clipboard works and shows visual confirmation (e.g., "Copied!")
- [ ] Mode toggle switches between Password and Passphrase output

---

## Phase 2: Full Options UI + Real-time Updates

**User stories**:
- As a user, I can easily customize and see results update live.
- As a non-technical user, I can generate a memorable passphrase I can actually remember.

### What to build

Add all controls for both modes and wire them to the generation engines so output updates on every option change. Password mode: length slider (8–64) with manual input, toggles for uppercase / lowercase / numbers / special characters, "avoid ambiguous characters" toggle, custom character include/exclude field. Passphrase mode: word count slider (3–12), separator selector (` ` `-` `_` `.` `None`), capitalize toggle, append number toggle, append symbol toggle. Add the strength indicator (color bar + estimated crack time via zxcvbn) and entropy/bits display beneath the output.

### Acceptance criteria

- [ ] All password mode controls render and update generation in real time
- [ ] All passphrase mode controls render and update generation in real time
- [ ] Length slider and manual input stay in sync
- [ ] At least one character class is always required (invalid state prevented)
- [ ] Strength indicator shows color + crack-time estimate after each generation
- [ ] Entropy bits display updates with options
- [ ] Show/hide toggle masks and reveals the generated output

---

## Phase 3: Trust, Polish & SEO

**User stories**:
- As a privacy-conscious user, I can verify everything happens locally.
- As a non-technical user, I feel confident the tool is secure.

### What to build

Dark/light mode with auto-detect (system preference) and a manual toggle. "Client-side only — nothing is sent to our servers" trust badge prominently displayed. Security disclaimers and a "Why this is secure" explanatory section below the tool. Full mobile-responsive layout pass. WCAG 2.1 AA audit: ARIA labels, keyboard navigation through all controls, focus management. SEO: optimized `<head>` meta tags, Open Graph tags, JSON-LD structured data, and descriptive below-the-fold content for organic ranking.

### Acceptance criteria

- [ ] Dark mode and light mode both render correctly; system preference is respected on first load
- [ ] "Client-side only" badge is visible without scrolling on desktop and mobile
- [ ] "Why this is secure" section is present below the tool
- [ ] All interactive controls are reachable and operable by keyboard alone
- [ ] No WCAG 2.1 AA violations reported by an automated checker (e.g., axe)
- [ ] `<title>`, `<meta description>`, Open Graph, and JSON-LD tags are present and correct
- [ ] Layout is usable on 375px–1440px viewports without horizontal scroll

---

## Phase 4: Monetization

**User stories**:
- (Business) Drive AdSense revenue and affiliate conversions without degrading tool UX.

### What to build

Integrate Google AdSense: place ad units below the tool and in the sidebar (desktop only) following AdSense layout policies. Add affiliate link section recommending password managers (Bitwarden, 1Password, NordPass, etc.) with disclosure language. Ensure ad and affiliate placements do not obscure controls or degrade Core Web Vitals. Add Google Analytics with event tracking for key interactions: mode switch, generate, copy, option changes.

### Acceptance criteria

- [ ] AdSense units load below the tool and in the sidebar on desktop
- [ ] Affiliate links are present with required disclosure ("This page contains affiliate links")
- [ ] Ad placements do not shift layout or cause CLS > 0.1
- [ ] Google Analytics fires on: page load, generate, copy, mode toggle
- [ ] Tool remains fully functional with an ad-blocker enabled (graceful degradation)

---

## Phase 5: Power User Features

**User stories**:
- As a power user, I can generate multiple passwords at once and export them.

### What to build

Bulk generation mode: generate 5, 10, or 25 outputs at once using the current options, each with its own copy button. Export the bulk list as `.txt` or `.csv`. Generation history panel showing the last 10 outputs, persisted in `localStorage`, with individual copy buttons and a clear-history action. Presets: named configurations ("Everyday", "Bank-level", "Memorable Passphrase", "Master Password") that populate options in one click. Keyboard shortcut `Cmd/Ctrl + G` to regenerate from anywhere on the page.

### Acceptance criteria

- [ ] Bulk generation produces the selected count using current options
- [ ] Each bulk result has its own copy button
- [ ] Export downloads a valid `.txt` and `.csv` file
- [ ] History panel shows up to 10 recent outputs, survives page reload
- [ ] Clear history removes all entries from display and `localStorage`
- [ ] All preset configurations load correct option values
- [ ] `Cmd/Ctrl + G` triggers regeneration regardless of focused element

---

## Phase 6: Advanced / PWA

**User stories**:
- (Exploratory) Power users and returning users who want deeper capability.

### What to build

QR code generation for the current output (client-side, using a qrcode library). Password strength checker: a separate input where users paste an existing password and receive a zxcvbn-based assessment. Custom wordlist upload: accept a plain-text file and use it in passphrase mode. Pronounceable password option: generate consonant-vowel alternating strings that are easier to read aloud. PWA support: `manifest.json`, service worker, installable on mobile and desktop. Shareable link: encode current options as encrypted URL parameters so a configuration can be shared without leaking the generated secret.

### Acceptance criteria

- [ ] QR code renders for the current output and updates on regeneration
- [ ] Strength checker accepts pasted input and displays crack-time + score
- [ ] Custom wordlist upload replaces the EFF list in passphrase mode for the session
- [ ] Pronounceable password output passes a basic "readable aloud" heuristic
- [ ] App installs via browser "Add to Home Screen" on iOS and Android
- [ ] Shareable link round-trips options correctly (decode → same settings)
- [ ] No generated secret is ever included in the shareable URL
