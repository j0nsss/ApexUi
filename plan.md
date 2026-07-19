# ApexUI — Implementation Plan

> Derived from: **PRD v1.0.0** (2026-07-19)
> Plan Version: **1.0**
> Status: **Ready for Engineering Review**

---

## Overview

ApexUI is an open-source, interactive UI Component Library and Design Vault built on a Next.js 14 / Supabase / Vercel Jamstack stack. This plan covers the full MVP (v1.0) delivery across 11 phases, from infrastructure setup through production launch.

**Total Estimated Duration:** ~10–11 weeks (assuming a 2–3 engineer team)

---

## Phase Summary

| Phase | Name                              | Duration  | Dependencies     |
| ----- | --------------------------------- | --------- | ---------------- |
| 0     | Project Setup & Infrastructure    | 1 week    | —                |
| 1     | Design System & Shared Primitives | 1 week    | Phase 0          |
| 2     | Database, Schema & Backend        | 1 week    | Phase 0          |
| 3     | Gallery — F-01                    | 1 week    | Phase 1, Phase 2 |
| 4     | 3-Panel Detail View — F-02        | 1.5 weeks | Phase 3          |
| 5     | Interactive Customizer — F-03     | 1 week    | Phase 4          |
| 6     | Mobile View — F-04                | 1 week    | Phase 4          |
| 7     | Live Data Toggle — F-05           | 3 days    | Phase 4          |
| 8     | Command K Search — F-06           | 3 days    | Phase 2, Phase 3 |
| 9     | Admin Analytics Dashboard — F-07  | 1.5 weeks | Phase 2          |
| 10    | QA, Performance & Accessibility   | 1 week    | Phases 3–9       |
| 11    | Launch Preparation                | 3 days    | Phase 10         |

---

## Phase 0 — Project Setup & Infrastructure

**Goal:** Get a working skeleton in version control and deployed to Vercel. Every subsequent phase builds on this foundation.

### Tasks

- [ ] **P0-1** Initialize Next.js 14 project with App Router and TypeScript (`npx create-next-app@14 --ts`)
- [ ] **P0-2** Configure Tailwind CSS 3.x; install `tailwindcss`, `postcss`, `autoprefixer`
- [ ] **P0-3** Create Supabase project; note connection strings and `anon`/`service_role` keys
- [ ] **P0-4** Set up `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **P0-5** Install and configure ESLint (`eslint-config-next`), Prettier, Husky, and `lint-staged`
- [ ] **P0-6** Connect GitHub repository; configure Vercel project with environment variables for `preview` and `production` environments
- [ ] **P0-7** Set up Vercel Edge Middleware stub (`middleware.ts`) for the `/admin` auth guard (implementation in Phase 9)
- [ ] **P0-8** Configure `vitest` and `@testing-library/react` for unit/component tests
- [ ] **P0-9** Configure Playwright with a `playwright.config.ts` targeting local dev server and preview URLs
- [ ] **P0-10** Add `next/font/google` imports for `Inter`, `Space Grotesk`, and `JetBrains Mono` with `display: 'swap'` and Latin subset

### Deliverables

- Working Next.js app deployed to a Vercel preview URL
- All tooling (lint, format, test) runnable locally and in CI
- Supabase project live with no schema yet (schema added in Phase 2)

---

## Phase 1 — Design System & Shared Primitives

**Goal:** Establish the ApexUI flat design system as a set of reusable React components and Tailwind tokens. No feature work yet — these components will be consumed in every subsequent phase.

### Tasks

#### 1.1 — Tailwind Theme Configuration

- [ ] **P1-1** Define all color tokens in `tailwind.config.ts`: `base (#0D0E11)`, `card (#16181D)`, `code (#1E222B)`, `border-default (#262930)`, `accent (#A31D1D)`, `accent-dim (#7A1515)`, `primary (#F5F2EB)`, `secondary (#9A9BA0)`, `muted (#5A5C63)`
- [ ] **P1-2** Cap `borderRadius` values at `4px`; set defaults of `2px` for `sm/DEFAULT` and `4px` for `md/lg`
- [ ] **P1-3** Define CSS custom properties in `globals.css` mirroring all Tailwind color tokens as `--color-*` variables

#### 1.2 — Typography

- [ ] **P1-4** Apply font variables from `next/font` to the root `layout.tsx` body element
- [ ] **P1-5** Define global heading (`h1`–`h4`) and body styles in `globals.css` matching the PRD typography spec (size, weight, color)
- [ ] **P1-6** Confirm `JetBrains Mono` is applied to all `<code>` and `<pre>` elements globally

#### 1.3 — Shared UI Component Library (`/components/ui/`)

- [ ] **P1-7** `Button` — primary (`bg-accent`) and secondary (`bg-card`) variants, hover/focus/disabled states per interaction spec
- [ ] **P1-8** `Tag` / `CategoryChip` — flat pill with `1px` solid border, no border-radius above 4px
- [ ] **P1-9** `TextInput` — `bg-code`, `1px` border, focus → `border-accent` per interaction spec
- [ ] **P1-10** `Toggle` — flat rectangular (non-pill), ON = `#A31D1D`, OFF = `#262930`
- [ ] **P1-11** `RangeSlider` — flat track in `#262930`, filled portion in `#A31D1D`, square thumb
- [ ] **P1-12** `SelectDropdown` — flat `1px` bordered, focus border → `#A31D1D`
- [ ] **P1-13** `ColorPickerSwatch` — grid of predefined palette swatches + hex `TextInput`
- [ ] **P1-14** `FlatTab` / `TabGroup` — `1px` bordered tabs, active tab with `border-bottom: 2px solid #A31D1D`
- [ ] **P1-15** `IconButton` — `1px` bordered, uses Lucide React icons at `stroke-width={1.5}`; sizes: 16/20/24px
- [ ] **P1-16** `Badge` / `CopyCount` — flat, inline, `bg-code` background
- [ ] **P1-17** `EmptyState` — flat bordered container for zero results / empty screens
- [ ] **P1-18** `LoadingSpinner` — `1px` bordered square rotating animation (no circles), per PRD spec

#### 1.4 — Motion Configuration

- [ ] **P1-19** Install Framer Motion 11.x
- [ ] **P1-20** Create `MotionContext` (React context) that reads `prefers-reduced-motion` and provides a `shouldAnimate` boolean
- [ ] **P1-21** Define reusable Framer Motion variants as exported constants: `panelVariants`, `sheetVariants`, `overlayVariants` per PRD spec (§8.5)

### Deliverables

- Storybook-equivalent local dev page (`/dev/components`) where all primitives can be visually verified
- Tailwind config and CSS variables confirmed working
- All shared components exported from `/components/ui/index.ts`

---

## Phase 2 — Database, Schema & Backend

**Goal:** Stand up the Supabase PostgreSQL schema, RLS policies, analytics views, and the Next.js/Edge Function API layer.

### Tasks

#### 2.1 — Schema Migrations

- [ ] **P2-1** Create `components` table with all columns including the `GENERATED ALWAYS AS` full-text `search_vector` column and all four indexes (category, slug, GIN search, published+sort_order)
- [ ] **P2-2** Create `code_variants` table with `UNIQUE(component_id, language)` constraint and component index
- [ ] **P2-3** Create `analytics_events` append-only table with all three indexes (event_type+created_at, component+event_type+created_at, created_at)
- [ ] **P2-4** Create `admin_users` table linked to `auth.users`

#### 2.2 — Row Level Security

- [ ] **P2-5** Enable RLS on all four tables
- [ ] **P2-6** Apply public read (published only) + admin write policies on `components`
- [ ] **P2-7** Apply public read + admin write policies on `code_variants`
- [ ] **P2-8** Apply admin-only read (no public SELECT) on `analytics_events`; INSERT to be done via service-role Edge Function only
- [ ] **P2-9** Apply admin-only policy on `admin_users`

#### 2.3 — Database Views

- [ ] **P2-10** Create `vw_daily_copy_events` aggregated view (daily copy counts)
- [ ] **P2-11** Create `vw_top_components` view (top 10 by copy count in last 30 days)

#### 2.4 — Seed Data

- [ ] **P2-12** Author seed SQL (or a `scripts/seed.ts` using the Supabase client) with at least 10 published components covering categories: `table`, `chart`, `navigation`, `bento`
- [ ] **P2-13** For each seeded component, insert at least 2 `code_variants` (`html`, `react-tsx`), including `{{param_name}}` placeholders for customizable values
- [ ] **P2-14** Include valid `customizer_schema` JSONB for each seeded component (at minimum: one slider, one color picker, one toggle per component where applicable)
- [ ] **P2-15** Include `random_data_schema` JSONB for all `table` and `chart` category components

#### 2.5 — API Routes (`/app/api/`)

- [ ] **P2-16** `GET /api/components` — returns all published components (metadata only, no code). Used for gallery ISR.
- [ ] **P2-17** `GET /api/components/[slug]` — returns full component record including `customizer_schema` and `random_data_schema`
- [ ] **P2-18** `GET /api/components/[slug]/code` — returns all `code_variants` for a given component slug. Response includes `Cache-Control: s-maxage=3600, stale-while-revalidate=86400`.
- [ ] **P2-19** `POST /api/analytics/copy` — validates request body (component_id, language, session_id), calls Supabase service-role client to insert into `analytics_events`, increments `copy_count` on `components`. Must return 200 immediately (fire-and-forget from client's perspective).
- [ ] **P2-20** `POST /api/analytics/pageview` — inserts a `page_view` event; same pattern as copy endpoint

#### 2.6 — Supabase Edge Function

- [ ] **P2-21** Create `/functions/v1/track-copy` Deno Edge Function with rate limiting: 100 copy events per IP per minute. This is the production-hardened version of P2-19 that adds IP hashing (`SHA-256`) and `user_agent_hash` before insert.

### Deliverables

- All tables created in Supabase with RLS active and verified via Supabase Studio
- Seed data confirming at least 10 components are queryable via `anon` key
- All API routes tested via `curl` or a REST client
- Edge Function deployed and rate-limit verified

---

## Phase 3 — Gallery (F-01: Immersive Flat Component Gallery)

**Goal:** Build the primary landing page — a responsive Bento Grid gallery of interactive component previews.

### Tasks

- [ ] **P3-1** Create the gallery page at `/app/page.tsx` using ISR (`revalidate = 60`) to fetch component metadata via `GET /api/components`
- [ ] **P3-2** Implement `BentoGrid` layout component: CSS Grid with `1px solid #262930` dividers, no gaps, no shadows, no gradients. Supports 1×1, 2×1, 2×2 cell sizes driven by the `bento_size` field.
- [ ] **P3-3** Implement `BentoCell` component: renders live interactive component miniature (not a screenshot), shows component name, category tag, and copy count badge
- [ ] **P3-4** Implement `BentoCell` hover state: `border-color` transition to `#A31D1D` in `80ms ease` via CSS `transition: border-color 80ms ease`
- [ ] **P3-5** Implement cell click handler: `router.push(/components/${slug})`
- [ ] **P3-6** Implement category filter chips (flat pill buttons, `1px` solid border). Filtering is client-side against the already-fetched component list — no additional API call on filter change.
- [ ] **P3-7** Use `generateStaticParams` to pre-render the top 20 components by `sort_order` at build time
- [ ] **P3-8** Implement page-view tracking: fire `POST /api/analytics/pageview` on gallery mount (non-blocking)

### Deliverables

- Gallery page live on Vercel preview, showing all seeded components in correct Bento grid layout
- Hover/filter interactions working correctly
- ISR revalidation confirmed via cache headers

---

## Phase 4 — 3-Panel Component Detail View (F-02)

**Goal:** Build the core power-user interface: the three-panel detail view for desktop (viewport ≥ 1024px).

### Tasks

#### 4.1 — Routing & Data Fetching

- [ ] **P4-1** Create dynamic route `/app/components/[slug]/page.tsx`
- [ ] **P4-2** Fetch full component record server-side (metadata + `customizer_schema` + `random_data_schema`); pass to client components via props
- [ ] **P4-3** Fetch `code_variants` server-side for pre-rendered (top 20) components; lazy-load via `GET /api/components/[slug]/code` for others

#### 4.2 — Layout Shell

- [ ] **P4-4** Create `DetailLayout` component: CSS Grid or Flexbox three-column layout (240px | flexible min-480px | 380px), visible only at viewport ≥ 1024px
- [ ] **P4-5** Implement panel collapse for Panels A and C using Framer Motion `panelVariants` (`width` transition, 200ms, `easeInOut`). Collapse toggle: `IconButton` with `1px` border.
- [ ] **P4-6** Manage collapse state with Zustand store

#### 4.3 — Panel A: Category Navigator

- [ ] **P4-7** Render hierarchical component list grouped by category; fetch all published component slugs/names from Supabase
- [ ] **P4-8** Highlight active component: `border-left: 2px solid #A31D1D`, `bg-code`
- [ ] **P4-9** Clicking a navigator item routes to the component's detail page

#### 4.4 — Panel B: Live Preview Canvas

- [ ] **P4-10** Render live component in isolation on `#16181D` background canvas with `4px` dot-grid pattern in `#262930`
- [ ] **P4-11** Make canvas scrollable if component height exceeds viewport
- [ ] **P4-12** Implement Viewport Mode toolbar toggle: Desktop (full width) / Tablet (768px constrained) / Mobile (375px constrained). Use a CSS `max-width` + centering wrapper to constrain the canvas.
- [ ] **P4-13** Fire `POST /api/analytics/pageview` on detail view mount (non-blocking)

#### 4.5 — Panel C: Code Editor

- [ ] **P4-14** Dynamically import Monaco Editor (`next/dynamic` with `ssr: false`) and register the `apexui-dark` custom theme on first load (token colors and editor colors per §8.7)
- [ ] **P4-15** Render code editor as read-only; content driven by active language tab + current customizer state (template interpolation applied client-side before display)
- [ ] **P4-16** Implement language tab switcher (`FlatTab`): show only variants that exist for the component (`html`, `tailwind`, `react-tsx`)
- [ ] **P4-17** Implement "Copy Code" button at top of Panel C:
  - On click: copy current code (post-interpolation) to clipboard via `navigator.clipboard.writeText`
  - Fire copy event async: `POST /api/analytics/copy` (non-blocking; do not await in event handler)
  - Button transitions: `idle` → `copied` (check-mark icon + "Copied" text) → `idle` after 1500ms via `useState` + `setTimeout`
  - No toast popup

### Deliverables

- Three-panel layout rendering correctly at 1024px+ breakpoint
- Monaco editor loading, displaying code, and updating on language tab switch
- Copy Code button functional with analytics event firing confirmed via Supabase logs

---

## Phase 5 — Interactive Customizer (F-03)

**Goal:** Wire the Customizer sidebar so that every parameter change instantly updates the live preview and regenerates the displayed code via template interpolation.

### Tasks

- [ ] **P5-1** Parse `customizer_schema.params` JSON to dynamically render the correct control type per parameter: `range_slider` → `RangeSlider`, `toggle_switch` → `Toggle`, `select_dropdown` → `SelectDropdown`, `color_picker` → `ColorPickerSwatch`, `text_input` → `TextInput`
- [ ] **P5-2** Associate every control with its `htmlFor` / `aria-labelledby` label for WCAG compliance
- [ ] **P5-3** Store customizer state in Zustand: `{ [paramKey: string]: string | number | boolean }`; initialize from schema defaults on component load
- [ ] **P5-4** Implement template interpolation engine: a pure function `interpolate(template: string, params: Record<string, any>): string` that replaces `{{param_name}}` occurrences with the current value for each key
- [ ] **P5-5** On any customizer value change:
  1. Update Zustand store
  2. Pass updated params to Live Preview Canvas (re-render component with new prop values)
  3. Run `interpolate()` on the raw code template from the database; update the Monaco editor's content
- [ ] **P5-6** Implement "Reset Defaults" button: resets Zustand customizer state to all schema `default` values
- [ ] **P5-7** Implement URL serialization: on any param change, write customizer state to URL query string (`?color=%23A31D1D&radius=0`) using `router.replace` (shallow, no page reload)
- [ ] **P5-8** On page load, read query string params and use them to initialize customizer state (overriding schema defaults where present), enabling deep-link sharing
- [ ] **P5-9** Wire "Customize" / "Code" tab switch within Panel C using `FlatTab`

### Deliverables

- Dragging a slider immediately updates both the preview and the code editor
- Sharing a URL with query params restores the customizer to the shared state
- Reset Defaults confirmed working

---

## Phase 6 — Mobile Component Catalog View (F-04)

**Goal:** Deliver a mobile-first browsing and copying experience for viewports below 768px.

### Tasks

- [ ] **P6-1** Conditionally render single-column catalog at `< 768px` using a responsive Tailwind breakpoint wrapper or a `useMediaQuery` hook
- [ ] **P6-2** Build `MobileCatalogCard`: component name, category tag, static preview thumbnail (server-rendered via `@vercel/og` or a Supabase Storage thumbnail — placeholder image acceptable in MVP if `@vercel/og` integration is deferred), and "Preview" link
- [ ] **P6-3** Create mobile detail route (re-use `/app/components/[slug]/page.tsx`) but detect mobile viewport and swap layout: full-screen Live Preview Canvas, Code Editor hidden by default, Customizer hidden by default
- [ ] **P6-4** Build sticky bottom action bar:
  - "Copy Code" button (full width, `bg-accent #A31D1D` background, `text-primary`)
  - "View Code" toggle button (half width, secondary style)
- [ ] **P6-5** Implement "View Code" bottom sheet:
  - Framer Motion `sheetVariants` (`y: '100%'` → `y: '0%'`, 250ms, ease `[0.32, 0.72, 0, 1]`)
  - Drag handle at top; dismissible by downward swipe (`dragConstraints`, `onDragEnd` velocity check > 500 or offset > 200) or close button
  - Code Editor panel rendered inside the sheet
- [ ] **P6-6** Disable Tablet/Desktop Viewport Mode toggles on mobile (show as visually disabled, `opacity: 40%`)
- [ ] **P6-7** Confirm the 3-panel detail layout does NOT render on viewports `< 768px`

### Deliverables

- Mobile catalog browsable at 375px viewport
- Bottom sheet slide-up/swipe-dismiss confirmed working on iOS Safari and Android Chrome

---

## Phase 7 — Live Data Toggle (F-05)

**Goal:** Add a "Populate Random Data" control to Table and Chart components that injects fresh random data into the live preview and code editor.

### Tasks

- [ ] **P7-1** In the Live Preview Canvas toolbar, conditionally render the "Populate Random Data" button only when the active component has `category === 'table' || 'chart'`
- [ ] **P7-2** Implement client-side data generation functions:
  - `generateTableData(schema: RandomDataSchema): Row[]` — produces 10–20 rows; column names and types driven by `random_data_schema` JSONB; uses a timestamp-seeded deterministic random function
  - `generateChartData(schema: RandomDataSchema): DataPoint[]` — produces 6–24 data points using a walking-random algorithm (each point is `prev_value + Math.random() * variance - variance/2`) to avoid flat or erratic output
- [ ] **P7-3** Implement the loading state: button enters flat loading state (label → `Generating...`, ellipsis animation); canvas overlays `#16181D` veil at 70% opacity with the square rotating `LoadingSpinner` component
- [ ] **P7-4** Complete the data injection cycle within 400ms: generate data → inject into preview → update code editor `data` variable via `interpolate()` → remove veil
- [ ] **P7-5** Expose a `useRandomData` hook that encapsulates the generation logic, loading state, and result

### Deliverables

- Button visible only on table/chart components
- Loading veil + spinner visible, then dismissed within 400ms
- Code editor updates with the new dataset after generation

---

## Phase 8 — Command K Global Search (F-06)

**Goal:** Implement a keyboard-triggered global search overlay backed by Supabase full-text search.

### Tasks

- [ ] **P8-1** Install `cmdk` 1.x; wrap and re-style the `Command` primitive with ApexUI design tokens
- [ ] **P8-2** Implement global `Cmd+K` / `Ctrl+K` keyboard listener in the root layout; toggle overlay visibility state
- [ ] **P8-3** Implement overlay design:
  - Backdrop: `#0D0E11` at 80% opacity, `backdrop-filter: none`
  - Modal: `#16181D` bg, `1px solid #262930` border, no border-radius above 4px
  - Search input: `#1E222B` bg, `1px #262930` border, focus → `1px #A31D1D` border
  - Animate with `overlayVariants` (Framer Motion, 120ms `easeOut`)
- [ ] **P8-4** Auto-focus search input on modal open; trap focus within modal (`aria-modal="true"`, `role="dialog"`)
- [ ] **P8-5** Wire search input to Supabase full-text search: `GET /api/search?q=<query>` with 80ms debounce. Server route queries `components` table via `search_vector @@ to_tsquery(...)`.
- [ ] **P8-6** Render result items: component name, category tag, small preview thumbnail. Implement arrow key navigation between results; `Enter` on focused result navigates to `/components/[slug]` and closes overlay.
- [ ] **P8-7** Implement "Recent Searches" stored in `localStorage`: display when query is empty; limit to last 5 unique searches
- [ ] **P8-8** Implement "No results" flat empty state: bordered container showing query text and a "Browse all components" link
- [ ] **P8-9** Close overlay on: `Escape` key, backdrop click, or result selection

### Deliverables

- Overlay opens/closes via keyboard shortcut from any page
- Search results appear within 80ms of keystroke (debounce + Supabase latency)
- Recent searches persist across page reloads

---

## Phase 9 — Admin Analytics Dashboard (F-07)

**Goal:** Build the internal, auth-gated `/admin` analytics dashboard with real-time data visualization.

### Tasks

#### 9.1 — Authentication

- [ ] **P9-1** Provision initial admin user(s) manually in Supabase Auth (email + password); insert corresponding record into `admin_users`
- [ ] **P9-2** Implement Next.js Edge Middleware (`middleware.ts`): for any request to `/admin/*`, validate Supabase Auth session from cookie. Redirect to `/admin/login` if unauthenticated.
- [ ] **P9-3** Build `/admin/login` page: flat email + password form, Supabase Auth `signInWithPassword`, redirect to `/admin` on success

#### 9.2 — Dashboard Shell

- [ ] **P9-4** Build `/admin/page.tsx`: protected server component that validates session server-side before rendering
- [ ] **P9-5** Render three KPI summary cards at top: "Total Copy Events (30d)", "Total Page Views (30d)", "Most Copied Component". Each card: `#16181D` bg, `1px #262930` border.

#### 9.3 — Chart Components (Recharts, ApexUI flat dark theme)

For all charts: no gradients, no curve smoothing, axes use `#F5F2EB` for labels and `#262930` for grid lines. Each chart tile: `#16181D` bg, `1px #262930` border.

- [ ] **P9-6** **Metric A — Copy Events Over Time:** Flat step-line chart; daily copy events from `vw_daily_copy_events` for last 30 days
- [ ] **P9-7** **Metric B — Top 10 Components by Copy Count:** Flat horizontal bar chart from `vw_top_components`; bars filled `#A31D1D`; flat tooltip on hover showing exact copy count
- [ ] **P9-8** **Metric C — Page Views by Route:** Flat grouped bar chart; page view events grouped by `route` for last 7 days
- [ ] **P9-9** **Metric D — Category Distribution:** Flat donut chart of copy events by component category; segments use distinct flat palette colors (no gradients)
- [ ] **P9-10** **Metric E — Real-Time Copy Feed:** Live-updating flat list polling Supabase Realtime every 5 seconds (`supabase.channel().on('postgres_changes', ...)`) showing most recent copy events (component name, timestamp, language variant)

#### 9.4 — Filters & Export

- [ ] **P9-11** Implement flat date-range picker (keyboard-accessible, using `date-fns` for date math). On range change, all API queries re-fire with new `from`/`to` parameters; all charts re-render.
- [ ] **P9-12** Implement "Export CSV" button: serialize current filtered analytics data to CSV client-side (using `array.map` + join); trigger download via `URL.createObjectURL(new Blob(...))`. No server-side export endpoint required.

### Deliverables

- `/admin/login` correctly authenticates and redirects
- Unauthenticated direct navigation to `/admin` redirects to login (tested in Playwright)
- All five charts render with real data from seed events
- Real-time copy feed updates visible within 5 seconds of a copy action

---

## Phase 10 — QA, Performance & Accessibility

**Goal:** Verify all MVP features against PRD requirements, hit performance targets, and achieve WCAG 2.1 AA compliance.

### Tasks

#### 10.1 — End-to-End Tests (Playwright)

- [ ] **P10-1** Test: Desktop Browse & Copy flow (gallery → hover → click → detail view → copy code → verify analytics event)
- [ ] **P10-2** Test: Command K Search flow (open overlay → type query → arrow navigate → Enter → verify navigation)
- [ ] **P10-3** Test: Mobile Browse & Copy flow (catalog → tap card → mobile detail → tap "Copy Code" → verify clipboard)
- [ ] **P10-4** Test: Admin Auth flow (unauthenticated redirect → login → dashboard loads → logout)
- [ ] **P10-5** Test: Customizer URL serialization (open component → change params → copy URL → open URL → verify params restored)

#### 10.2 — Unit & Component Tests (Vitest + RTL)

- [ ] **P10-6** `interpolate()` template engine: unit test all parameter types including edge cases (missing key, numeric zero, false boolean)
- [ ] **P10-7** `generateTableData()` and `generateChartData()`: verify output shape, row count ranges (10–20 rows, 6–24 points)
- [ ] **P10-8** `BentoCell` component: hover state, click handler, correct size class for 1×1 / 2×1 / 2×2
- [ ] **P10-9** `CopyButton` component: idle → copied → idle state transitions with timer

#### 10.3 — Performance (Lighthouse / Core Web Vitals)

Target: LCP ≤ 2.5s, FCP ≤ 1.2s, TTI ≤ 3.5s, TBT ≤ 200ms, CLS ≤ 0.1

- [ ] **P10-10** Audit Monaco Editor dynamic import: confirm it does not contribute to TBT on initial load
- [ ] **P10-11** Audit Framer Motion: confirm per-component imports only (not global bundle import)
- [ ] **P10-12** Confirm Supabase code variant responses include `Cache-Control: s-maxage=3600, stale-while-revalidate=86400` headers
- [ ] **P10-13** Run Lighthouse CI on gallery and top 3 component detail pages; fix any score below target
- [ ] **P10-14** Confirm ISR `revalidate = 60` is working (check `X-Vercel-Cache: HIT` header on second request)

#### 10.4 — Accessibility

- [ ] **P10-15** Audit all interactive elements for minimum `44×44px` touch target
- [ ] **P10-16** Verify `#F5F2EB` on `#0D0E11` contrast ratio (target ≈ 17.8:1 — will pass)
- [ ] **P10-17** Verify `#A31D1D` on `#0D0E11` contrast ratio (target ≈ 4.6:1 — meets AA for large/bold text; confirm usage is accent/border only, not body copy)
- [ ] **P10-18** Confirm Command K overlay has `aria-modal="true"`, `role="dialog"`, and focus trap working
- [ ] **P10-19** Confirm all customizer form controls have associated `htmlFor` / `aria-labelledby` labels
- [ ] **P10-20** Verify full keyboard navigation (Tab order, arrow keys in search results, Enter/Escape handling) site-wide
- [ ] **P10-21** Test `prefers-reduced-motion`: confirm all Framer Motion animations are disabled and state changes are instant

#### 10.5 — Cross-Browser

- [ ] **P10-22** Test on Chrome 110+ (Chromium)
- [ ] **P10-23** Test on Firefox 110+
- [ ] **P10-24** Test on Safari 16+ (macOS + iOS)
- [ ] **P10-25** Test on Edge 110+

### Deliverables

- All Playwright e2e tests passing in CI on Vercel preview URL
- Lighthouse scores meeting or exceeding all PRD targets
- Zero WCAG 2.1 AA violations on critical paths (galaxy, detail view, search overlay, admin login)

---

## Phase 11 — Launch Preparation

**Goal:** Prepare the project for public release as an open-source repository.

### Tasks

- [ ] **P11-1** Write `README.md`: project overview, screenshot/GIF of the gallery, quick start guide, how to run locally, how to seed the database, contribution guidelines link
- [ ] **P11-2** Write `CONTRIBUTING.md`: how to submit a new component (schema format, code template format, PR checklist)
- [ ] **P11-3** Add `LICENSE` file (MIT or Apache 2.0 — confirm with principal team)
- [ ] **P11-4** Configure GitHub repository: description, topics (`nextjs`, `supabase`, `ui-components`, `tailwind`, `open-source`), social preview image
- [ ] **P11-5** Add GitHub issue templates: Bug Report, Feature Request, Component Submission
- [ ] **P11-6** Expand seed data to a minimum of 20 published components across all four categories to ensure the gallery is compelling at launch
- [ ] **P11-7** Seed `analytics_events` with synthetic historical data (30 days backdated) so the admin dashboard charts are non-empty on day one
- [ ] **P11-8** Final production deployment to Vercel: confirm all environment variables are set for `production`, ISR is working, Edge Middleware is active
- [ ] **P11-9** Set up uptime monitoring (e.g., Vercel Checks or an external ping service) on the production URL
- [ ] **P11-10** Post-launch: submit to relevant directories (CSS Design Awards, Open Source Alternatives, Product Hunt — planned separately)

### Deliverables

- Public GitHub repository live with README, CONTRIBUTING, and LICENSE
- Production Vercel deployment with at least 20 components available
- Admin dashboard showing synthetic 30-day history

---

## Dependencies & Risk Register

| Risk                                                                  | Likelihood | Impact | Mitigation                                                                                                                                                           |
| --------------------------------------------------------------------- | ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monaco Editor bundle size causes LCP regression                       | Medium     | High   | Dynamic import is mandatory (P4-14); measure with Lighthouse CI in Phase 10 before shipping                                                                          |
| Supabase full-text search latency exceeds 200ms target                | Low        | Medium | Add `search_vector` GIN index (P2-1); enable Supabase connection pooling; cache popular queries in memory with `useMemo`                                             |
| `prefers-reduced-motion` context misses some Framer components        | Medium     | Medium | Central `MotionContext` (P1-20) must be consumed in all animated components; add a Playwright test (P10-21)                                                          |
| iOS Safari swipe-dismiss on bottom sheet conflicts with native scroll | Medium     | Medium | Use `dragConstraints` correctly (P6-5); test on real device, not just emulator                                                                                       |
| Admin auth middleware bypassed by direct API call                     | Low        | High   | Supabase RLS (Phase 2) is the true enforcement layer; middleware is UX-only. All admin data queries use service-role key server-side only (never exposed to client). |
| Component code in DB gets out of sync with design intent              | Low        | Medium | V2 GitHub API Sync (§9.2 of PRD) addresses this; document the `{{param_name}}` template format clearly in CONTRIBUTING.md                                            |

---

## Key Technical Decisions (Summary)

These are constraints derived directly from the PRD — they are non-negotiable and must not be deviated from without a PRD version bump.

- **No `box-shadow`, `backdrop-filter: blur`, or `linear-gradient`/`radial-gradient` on any structural UI surface.** Verified by a custom ESLint or Stylelint rule if possible.
- **`border-radius` cap of 4px** on all containers, panels, and modals.
- **Monaco Editor loaded via `next/dynamic` with `ssr: false`** — never imported at the top level.
- **Copy analytics events must never block the UI.** Use `fetch()` without `await` in the click handler (fire-and-forget).
- **`/admin` is protected at both the Edge Middleware level AND via Supabase Auth session validation server-side.** Client-side route guarding alone is not sufficient (per §5.4).
- **All component source code lives in Supabase, not the frontend codebase.** Zero hardcoded component code in the Next.js app.
- **Framer Motion animations must respect `prefers-reduced-motion`** via the global `MotionContext` — this affects Playwright test coverage requirements.

---

_End of Plan — ApexUI v1.0 Implementation Plan_
