# ApexUI — Product Requirements Document

---

## Meta Information

| Field              | Value                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| **Document Title** | ApexUI — Next-Gen Open Source Design Vault: Product Requirements Document |
| **Version**        | 1.0.0                                                                     |
| **Status**         | Draft — Ready for Engineering Review                                      |
| **Date**           | 2026-07-19                                                                |
| **Author**         | Principal Product & Architecture Team                                     |
| **Reviewers**      | Engineering Lead, Design Lead, QA Lead                                    |
| **Classification** | Internal — Source of Truth                                                |

---

## Table of Contents

1. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
2. [Target Audience & User Personas](#2-target-audience--user-personas)
3. [Core Features & Functional Requirements](#3-core-features--functional-requirements)
4. [User Flows](#4-user-flows)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Technical Architecture & Tech Stack](#6-technical-architecture--tech-stack)
7. [High-Level Database Schema](#7-high-level-database-schema)
8. [UI/UX & Design System Guidelines](#8-uiux--design-system-guidelines)
9. [Future Roadmap — V2+](#9-future-roadmap--v2)

---

## 1. Executive Summary & Product Vision

### 1.1 Overview

ApexUI is an open-source, interactive UI Component Library and Design Vault built for the modern frontend developer. It functions as a self-contained platform where any developer can browse, live-preview, customize, and immediately copy production-grade UI component code — without downloading SDKs, reading lengthy documentation, or configuring a local environment.

ApexUI is not a documentation site. It is an **interactive development tool** that collapses the gap between design inspiration and production-ready code. Every component in the library is live — it can be hovered, clicked, populated with random data, visually customized, and inspected down to the source line.

### 1.2 Product Vision Statement

> _"ApexUI makes premium UI components instantly accessible to every developer — turning inspiration into shippable code in under 60 seconds."_

### 1.3 Strategic Objectives

- Establish ApexUI as the go-to open-source reference for high-quality, dark-flat-design UI primitives and patterns.
- Demonstrate full-stack engineering excellence through a meticulously crafted, production-grade codebase suitable as a senior-level portfolio artifact.
- Grow an organic developer community that contributes components, opens issues, and forks the repository.
- Provide measurable internal insight through a backend analytics dashboard that tracks usage patterns and component popularity in real time.

### 1.4 Success Metrics (MVP)

| Metric                            | Target (90 days post-launch)  |
| --------------------------------- | ----------------------------- |
| GitHub Stars                      | ≥ 500                         |
| Monthly Active Users              | ≥ 2,000                       |
| Component Copy Events             | ≥ 10,000 / month              |
| Avg. Time-to-Copy                 | ≤ 60 seconds per session      |
| Lighthouse Performance Score      | ≥ 90 (desktop), ≥ 85 (mobile) |
| Core Web Vitals — LCP             | ≤ 2.5s                        |
| Accessibility Score (WCAG 2.1 AA) | 100% on all critical paths    |

---

## 2. Target Audience & User Personas

### 2.1 Primary Persona — "The Pragmatic Frontend Developer"

**Name:** Alex, 28  
**Role:** Mid-to-Senior Frontend / Full-Stack Developer  
**Stack:** React, Next.js, Tailwind CSS, TypeScript  
**Context:** Works at a mid-size product company or as a freelancer. Regularly needs high-quality UI components fast. Frustrated by component libraries that require heavy theming configuration or look generic.

**Goals:**

- Find and copy a production-ready `DataTable` or `LineChart` component in under 2 minutes.
- Inspect real source code, not abstracted JSX props documentation.
- Tweak colors or data structure and see changes in real time.

**Pain Points:**

- Most UI libraries are either too opinionated (hard to unskin) or too bare (require significant extra work).
- Documentation sites are slow and require local install before seeing any real output.
- Generic light-mode default aesthetics don't match the dark-mode product they are building.

---

### 2.2 Secondary Persona — "The Design-Conscious Student / Junior Developer"

**Name:** Priya, 22  
**Role:** CS Graduate / Junior Developer building portfolio projects  
**Context:** Learning React and Tailwind. Needs to build impressive-looking projects quickly. Browsing for component inspiration.

**Goals:**

- See what a polished, modern UI actually looks like in code.
- Copy components and learn from clean, well-structured source.
- Use the live customizer to experiment with design parameters without touching code.

**Pain Points:**

- Most open-source code examples are outdated (class components, no TypeScript).
- No interactivity — looking at a static screenshot tells them nothing about hover states or animations.

---

### 2.3 Tertiary Persona — "The Internal Platform/Admin Consumer"

**Name:** Jordan, 35  
**Role:** Engineering Manager / Internal Tooling Lead  
**Context:** Uses the internal Admin Analytics Dashboard to understand which components are most popular and make data-driven decisions on what to build next for the library.

**Goals:**

- View a real-time breakdown of component copy events and page views.
- Identify underperforming components that need improvement.
- Export analytics data for quarterly reviews.

**Pain Points:**

- No visibility into how open-source tools are actually being used without custom instrumentation.

---

## 3. Core Features & Functional Requirements

> **Scope Definition:** This section defines the Minimum Viable Product (MVP). All items marked `[MVP]` must ship in v1.0. Items marked `[V2]` are deferred.

---

### 3.1 Feature F-01: Immersive Flat Component Gallery `[MVP]`

**Description:** The gallery is the primary entry surface. It presents all available UI components in a structured Bento Grid layout. Each cell is a self-contained interactive preview.

**Functional Requirements:**

- **FR-1.1** The gallery SHALL render as a responsive Bento Grid using `1px` solid borders (`#262930`) as cell dividers. No gaps, no shadows, no gradients.
- **FR-1.2** Each grid cell SHALL display a live, interactive miniature render of its component (not a static screenshot or image).
- **FR-1.3** On hover, a grid cell's border SHALL instantly transition to `#A31D1D` (Crimson/Maroon). No glow, no box-shadow. The transition must be CSS `transition: border-color 80ms ease`.
- **FR-1.4** Each grid cell SHALL display: Component Name, Category Tag (e.g., `Table`, `Chart`, `Navigation`), and a Copy Count badge showing total copy events.
- **FR-1.5** The gallery SHALL support filtering by Category. Filter chips SHALL be rendered as flat pill buttons with `1px` solid borders.
- **FR-1.6** Grid cells SHALL support three display sizes: 1×1, 2×1, and 2×2, determined by a `size` attribute on the component record. Complex components (e.g., DataTable) use 2×2.
- **FR-1.7** On click, a grid cell SHALL navigate the user to the component's dedicated Detail View (F-02).

---

### 3.2 Feature F-02: 3-Panel Component Detail View (Desktop) `[MVP]`

**Description:** The core interaction surface. When a user selects a component, the interface expands into a three-panel layout providing simultaneous access to the live preview, the source code, and the customizer.

**Functional Requirements:**

- **FR-2.1** The layout SHALL render as three fixed vertical panels side-by-side on desktop (viewport ≥ 1024px):
  - **Panel A (Left — 240px fixed):** Category Navigator / Component List.
  - **Panel B (Center — flexible, min 480px):** Live Preview Canvas.
  - **Panel C (Right — 380px fixed):** Code Editor + Customizer Sidebar.
- **FR-2.2** Panel A SHALL display a hierarchical list of all component categories and their children. The active component SHALL be highlighted with a `#A31D1D` left-side `2px` solid border indicator.
- **FR-2.3** Panel B (Live Preview Canvas) SHALL render the actual component in isolation on a `#16181D` background canvas.
  - The canvas SHALL be scrollable if the component's rendered height exceeds the viewport.
  - A "Viewport Mode" toggle in Panel B's toolbar SHALL allow switching between Desktop (full width), Tablet (768px constrained), and Mobile (375px constrained) preview sizes.
  - The canvas background SHALL use a subtle `4px` dot-grid pattern in `#262930` to provide depth reference without gradients.
- **FR-2.4** Panel C (Code Editor) SHALL display the component source code rendered in Monaco Editor or Prism.js with a custom ApexUI dark theme.
  - The editor SHALL be read-only by default. Users cannot modify code in-place; code updates are driven exclusively by the Customizer.
  - A syntax language toggle SHALL allow switching between `HTML`, `Tailwind CSS`, `React/TSX` code variants for the same component. Only variants that exist for a component SHALL be shown.
  - Code SHALL be retrieved from Supabase/backend on panel load. It SHALL NOT be hardcoded in the frontend.
- **FR-2.5** A "Copy Code" button SHALL be prominently placed at the top of Panel C. On click:
  - The component code for the currently selected variant (HTML / Tailwind / React) SHALL be copied to the user's clipboard.
  - A copy event SHALL be fired asynchronously to the backend analytics endpoint. This call must NOT block the UI.
  - The button SHALL display a flat check-mark confirmation state for 1500ms, then revert. No toast pop-ups.
- **FR-2.6** Panels A and C SHALL be collapsible by the user via a `1px` bordered icon button. Collapse/expand SHALL use a Framer Motion `layout` animation (width transition, no opacity fade, 200ms).

---

### 3.3 Feature F-03: Interactive Customizer `[MVP]`

**Description:** A flat sidebar panel within the Detail View that allows users to tweak component parameters. Changes must propagate to the Live Preview Canvas and the Code Editor in real time, with no page reload.

**Functional Requirements:**

- **FR-3.1** The Customizer SHALL be rendered as a flat sidebar below (or embedded in) the Code Editor panel (Panel C). A tab switcher with flat `1px` bordered tabs SHALL allow the user to toggle between "Code" and "Customize" views.
- **FR-3.2** Each component in the database SHALL have a JSON-serialized `customizer_schema` field that defines its available parameters, their types, default values, min/max constraints, and display labels.
  - Supported parameter input types: `color_picker`, `range_slider`, `text_input`, `select_dropdown`, `toggle_switch`.
- **FR-3.3** All customizer controls SHALL follow the flat design system:
  - **Sliders:** Full-width flat track (`#262930`), filled portion in `#A31D1D`, no border-radius on the thumb.
  - **Toggles:** Flat rectangular (not pill-shaped), `ON` state fills with `#A31D1D`, `OFF` state is `#262930` with a `1px` `#262930` border.
  - **Dropdowns:** Flat `1px` bordered select control. On focus, border changes to `#A31D1D`.
  - **Color Pickers:** A flat swatch grid with predefined palette options + a hex input field.
- **FR-3.4** When any customizer control value changes, the system SHALL:
  1. Update the component's rendered state in the Live Preview Canvas immediately (optimistically, client-side).
  2. Regenerate the displayed source code in the Code Editor by substituting the new parameter values into the stored code template. Template interpolation SHALL use a `{{param_name}}` syntax stored in the database code template.
- **FR-3.5** A "Reset Defaults" button SHALL restore all customizer fields to the component's default parameter values from the schema.
- **FR-3.6** The customizer state SHALL be serializable to a URL query string (e.g., `?color=%23A31D1D&radius=0`), allowing users to share a customized variant via a deep link.

---

### 3.4 Feature F-04: Mobile Component Catalog View `[MVP]`

**Description:** On mobile viewports (< 768px), the interface pivots to a component-catalog-first experience. The 3-panel layout is not viable at mobile widths; instead, the UI focuses on browsability and instant code copying.

**Functional Requirements:**

- **FR-4.1** On viewport < 768px, the 3-panel layout SHALL NOT render. The interface SHALL display a single-column scrollable catalog of component cards.
- **FR-4.2** Each mobile catalog card SHALL display: the Component Name, Category Tag, a static preview thumbnail (server-side rendered image via `@vercel/og` or equivalent), and a "Preview" link.
- **FR-4.3** Tapping a component card SHALL navigate to a full-screen mobile Detail View:
  - The Live Preview Canvas SHALL take up the full viewport width.
  - The Code Editor panel SHALL be hidden by default.
  - The Customizer SHALL be hidden by default.
- **FR-4.4** A sticky bottom action bar SHALL be present on the mobile Detail View containing:
  - A "Copy Code" button (full width, flat, `#A31D1D` background).
  - A "View Code" toggle button that slides up a bottom sheet (Framer Motion `y` translate animation) containing the Code Editor panel.
- **FR-4.5** The mobile "View Code" bottom sheet SHALL be dismissible via a downward swipe or a close button.
- **FR-4.6** The mobile Viewport Mode toggle SHALL allow previewing the component at the device's actual native width only. Tablet/Desktop mode toggles SHALL be disabled on mobile.

---

### 3.5 Feature F-05: Live Data Toggle `[MVP]`

**Description:** Available exclusively on Table and Chart component types. A control that replaces the component's static sample data with freshly generated random data on demand.

**Functional Requirements:**

- **FR-5.1** The "Populate Random Data" button SHALL appear in the Live Preview Canvas toolbar only when the active component has `category` of `table` or `chart`.
- **FR-5.2** On click, the button SHALL:
  1. Immediately enter a flat loading state: the button label changes to a flat animated ellipsis (`Generating...`), the component canvas overlays a `#16181D` flat veil at 70% opacity with a centered minimal spinner (a `1px` bordered square rotating — no circles).
  2. Generate a new random dataset client-side (no server call required for data generation).
  3. Inject the new dataset into the component's live render.
  4. Remove the loading veil.
  - The entire cycle SHALL complete within 400ms.
- **FR-5.3** Random data generation rules SHALL be defined per component type:
  - **Tables:** Generate 10–20 rows of contextually appropriate fake data using a deterministic seeded random function (e.g., using `Math.random` with a timestamp seed). Column names and data types are defined in the component's `random_data_schema` field in the database.
  - **Charts:** Generate between 6 and 24 data points with realistic variance (using a walking-random algorithm to avoid data that looks completely flat or erratic).
- **FR-5.4** The generated dataset SHALL also update the code displayed in the Code Editor panel (replacing the `data` prop/variable in the source).

---

### 3.6 Feature F-06: Command K Global Search `[MVP]`

**Description:** A keyboard-triggered global search overlay for instantly finding components by name, category, or tag.

**Functional Requirements:**

- **FR-6.1** Pressing `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux) from any page SHALL open the search overlay.
- **FR-6.2** The search overlay SHALL render as a centered modal with the following flat design spec:
  - Backdrop: `#0D0E11` at 80% opacity (no blur — `backdrop-filter: none`).
  - Modal container: `#16181D` background, `1px` solid `#262930` border, no border-radius.
  - Search input: `#1E222B` background, `1px` `#262930` border, `#F5F2EB` text, `#A31D1D` focus border.
- **FR-6.3** The search input SHALL be auto-focused on modal open. Results SHALL update on every keystroke with a debounce of 80ms.
- **FR-6.4** Search SHALL query against component `name`, `category`, `tags[]`, and `description` fields. Results are fetched from the backend (Supabase full-text search via `tsvector`).
- **FR-6.5** Result items SHALL display: Component Name, Category Tag, and a small live preview thumbnail. Arrow key navigation between results SHALL be supported. `Enter` on a focused result SHALL navigate to the component detail view and close the overlay.
- **FR-6.6** The overlay SHALL close on: `Escape` key, clicking the backdrop, or selecting a result.
- **FR-6.7** The overlay SHALL support "Recent Searches" (stored in `localStorage`) displayed when the search input is empty.
- **FR-6.8** A "No results" state SHALL display: a flat bordered empty state with the query text and a suggestion to "Browse all components".

---

### 3.7 Feature F-07: Admin Analytics Dashboard `[MVP — Internal, Auth-gated]`

**Description:** An internal, authentication-protected route (`/admin`) that provides a real-time analytics view of platform usage.

**Functional Requirements:**

- **FR-7.1** The `/admin` route SHALL require authentication via Supabase Auth (email + password). There is no public sign-up; admin accounts are provisioned manually in the database.
- **FR-7.2** The dashboard SHALL display the following data visualizations, all rendered using Recharts with the ApexUI flat dark theme (high-contrast, no gradients, no curve smoothing on lines):
  - **Metric A — Copy Events Over Time:** A flat step-line chart showing total copy events per day for the last 30 days.
  - **Metric B — Top 10 Components by Copy Count:** A flat horizontal bar chart, bars filled with `#A31D1D`.
  - **Metric C — Page Views by Route:** A flat grouped bar chart showing page views per unique path over the last 7 days.
  - **Metric D — Category Distribution:** A flat donut chart showing the distribution of copy events across component categories. No gradients on segments; each segment uses a color from the defined flat palette.
  - **Metric E — Real-Time Copy Feed:** A live-updating flat list (polling every 5 seconds via Supabase Realtime) of the most recent copy events, displaying: component name, timestamp, and code variant copied.
- **FR-7.3** Each chart tile SHALL be a `#16181D` container with `1px` `#262930` borders. Chart axes SHALL use `#F5F2EB` for labels, `#262930` for grid lines.
- **FR-7.4** A date-range picker (flat, keyboard-accessible) SHALL allow filtering all metrics to a custom date range.
- **FR-7.5** A "Export CSV" button SHALL export the currently filtered analytics data as a CSV file downloaded client-side. No server-side export endpoint is required in MVP.
- **FR-7.6** The dashboard SHALL display three KPI summary cards at the top: Total Copy Events, Total Page Views (last 30d), and Most Copied Component.

---

## 4. User Flows

### 4.1 Desktop User Flow — Browse & Copy a Component

```
[Landing Page — Gallery View]
        │
        ▼
User scans the Bento Grid gallery.
Hovers a "DataTable" cell → border flashes to #A31D1D.
        │
        ▼
User clicks the "DataTable" cell.
        │
        ▼
[Component Detail View — 3-Panel Layout loads]
Panel A: Category Navigator highlights "Tables > DataTable"
Panel B: Live DataTable component renders with sample data
Panel C: Code Editor loads React/TSX source from backend
        │
        ├─── User clicks "Populate Random Data" button
        │         → 400ms flat loading veil overlay
        │         → New 15-row dataset injected into component
        │         → Code editor updates `data` variable with new rows
        │
        ├─── User clicks "Customize" tab in Panel C
        │         → Customizer sidebar slides in (Framer Motion width animation)
        │         → User drags "Row Height" slider from 48px to 56px
        │         → Preview canvas updates instantly
        │         → Code template re-renders with new value
        │
        ├─── User clicks "TSX" language tab
        │         → Code editor updates to show React/TSX variant
        │
        └─── User clicks "Copy Code"
                  → Code copied to clipboard
                  → Copy event fired async to backend (POST /api/analytics/copy)
                  → Button shows flat "✓ Copied" for 1500ms, reverts
                  → User pastes code into their own project
```

---

### 4.2 Desktop User Flow — Discover via Command K Search

```
User is anywhere on the site.
Presses Cmd+K (macOS) or Ctrl+K (Windows/Linux).
        │
        ▼
[Command K Overlay opens]
Backdrop darkens to #0D0E11 @80%. Modal appears.
Input is auto-focused.
        │
        ▼
User types "chart"
→ Results update in 80ms: "Line Chart", "Bar Chart", "Donut Chart", "Area Chart"
        │
        ▼
User presses ↓ arrow to highlight "Bar Chart"
Presses Enter.
        │
        ▼
[Component Detail View — Bar Chart loads]
Overlay closes, navigation is instant (Next.js client-side routing).
```

---

### 4.3 Mobile User Flow — Browse & Copy a Component

```
[Mobile Landing — Single-Column Component Catalog]
        │
        ▼
User scrolls the catalog card list.
Taps the "Bento Grid" component card.
        │
        ▼
[Mobile Detail View — Full-Screen Preview Canvas]
Live Bento Grid component renders at full mobile width (375px).
Sticky bottom bar is visible: [View Code] [Copy Code]
        │
        ├─── User taps "View Code" button
        │         → Bottom sheet slides UP (Framer Motion y-translate, 250ms)
        │         → Code Editor panel visible inside bottom sheet
        │         → User can scroll the code
        │         → Swipe down or tap X to dismiss
        │
        └─── User taps "Copy Code" button (full-width, #A31D1D bg)
                  → React/TSX variant copied (default variant)
                  → Copy event fired async to backend
                  → Button text changes to "✓ Code Copied!" for 1500ms
```

---

### 4.4 Admin User Flow — View Analytics

```
Admin navigates to /admin
        │
        ▼
[Auth Gate — Supabase Auth login form]
Admin enters email + password credentials.
Supabase Auth validates → session token issued.
        │
        ▼
[Admin Analytics Dashboard loads]
KPI cards render: Total Copies, Total Page Views, Top Component
Charts render with last 30 days of data (default range)
Real-Time Copy Feed begins polling (5s interval)
        │
        ├─── Admin adjusts date range picker to "Last 7 Days"
        │         → All charts and KPI cards re-query and re-render
        │
        ├─── Admin hovers "Top 10 Components" bar chart
        │         → Flat tooltip appears: Component name, exact copy count
        │
        └─── Admin clicks "Export CSV"
                  → Current filtered analytics data serialized to CSV
                  → File downloaded to local machine via browser
```

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Requirement                        | Target                                         |
| ---------------------------------- | ---------------------------------------------- |
| **Largest Contentful Paint (LCP)** | ≤ 2.5s on a simulated 4G connection            |
| **First Contentful Paint (FCP)**   | ≤ 1.2s                                         |
| **Time to Interactive (TTI)**      | ≤ 3.5s                                         |
| **Total Blocking Time (TBT)**      | ≤ 200ms                                        |
| **Cumulative Layout Shift (CLS)**  | ≤ 0.1                                          |
| **Component Code Load Time**       | ≤ 300ms after panel open (from Supabase cache) |
| **Search Result Latency**          | ≤ 200ms from keystroke (including debounce)    |
| **Analytics Dashboard Load**       | ≤ 1.5s for initial chart render                |

**Implementation Strategies:**

- All component code is served via Supabase Edge Functions with `Cache-Control: max-age=3600` headers and CDN caching at the edge.
- Gallery page uses `ISR` (Incremental Static Regeneration) with a revalidation interval of 60 seconds.
- Component detail pages use Next.js `generateStaticParams` to pre-render the top 20 most-visited components at build time.
- The Monaco Editor is loaded via dynamic import (`next/dynamic` with `ssr: false`) to prevent it from blocking the initial page load.
- Framer Motion is imported selectively per-component (not globally) to minimize bundle impact.

### 5.2 Accessibility (WCAG 2.1 AA Compliance)

- All interactive elements (buttons, tabs, sliders, toggles) SHALL have a minimum touch target of `44×44px`.
- All color contrast ratios SHALL meet WCAG 2.1 AA minimums:
  - `#F5F2EB` (Warm Cream) on `#0D0E11` (Matte Black): Contrast ratio ≈ 17.8:1 (exceeds 4.5:1 AA).
  - `#A31D1D` (Crimson) on `#0D0E11`: Contrast ratio ≈ 4.6:1 (meets AA for large/bold text; used primarily for borders and accents, not body copy).
- All images and icons SHALL include descriptive `alt` attributes or `aria-label` attributes.
- The Command K overlay SHALL trap focus within the modal when open. `aria-modal="true"` and `role="dialog"` SHALL be applied.
- All form controls in the Customizer SHALL be associated with their labels via `htmlFor` / `aria-labelledby`.
- Keyboard navigation SHALL be fully supported site-wide. Tab order SHALL be logical and follow visual reading order.
- The application SHALL not trigger any motion that violates `prefers-reduced-motion`. When this media query is detected, all Framer Motion animations SHALL be disabled via a global context, reverting to instant state changes.

### 5.3 Responsiveness & Breakpoints

| Breakpoint        | Label     | Behavior                                                                                   |
| ----------------- | --------- | ------------------------------------------------------------------------------------------ |
| `< 640px`         | Mobile-S  | Single-column catalog. Mobile Detail View. Sticky Copy bar.                                |
| `640px – 767px`   | Mobile-L  | Single-column catalog. Mobile Detail View. Wider cards.                                    |
| `768px – 1023px`  | Tablet    | 2-column catalog grid. Simplified 2-panel detail view (preview + code; no left navigator). |
| `1024px – 1279px` | Desktop-S | Full 3-panel layout. Panels A and C at reduced widths.                                     |
| `≥ 1280px`        | Desktop-L | Full 3-panel layout at specified widths (240 / flexible / 380).                            |

### 5.4 Security

- The Admin dashboard route (`/admin`) SHALL be protected server-side via Supabase Auth session validation in Next.js middleware. Client-side route guarding alone is not sufficient.
- All analytics event endpoints SHALL be rate-limited at the edge (Vercel Edge Middleware or Supabase Edge Functions). Rate limit: 100 copy events per IP per minute.
- Component code content is read-only from the database via a restricted Supabase `anon` role with Row Level Security (RLS) policies permitting only `SELECT` on the `components` and `code_variants` tables.
- No user-generated content is accepted in the MVP. All components are admin-curated, eliminating XSS risk from user input in the code display context.
- API keys and Supabase service role keys SHALL never be exposed to the client. All privileged database operations are routed through Next.js API routes (server-side) or Supabase Edge Functions with the service role key in the server environment.

### 5.5 Browser Support

- Chromium-based browsers: Chrome 110+, Edge 110+ — Full support.
- Firefox 110+ — Full support.
- Safari 16+ (macOS & iOS) — Full support.
- Internet Explorer — Not supported.

---

## 6. Technical Architecture & Tech Stack

### 6.1 Architecture Overview

ApexUI follows a **Jamstack** architecture with a Backend-as-a-Service (BaaS) layer. The frontend is a Next.js application deployed on Vercel. All persistent data — including component metadata, code variants, customizer schemas, and analytics events — is stored in Supabase (PostgreSQL). The architecture prioritizes edge-cached static content delivery for public pages, with server-side data fetching for admin-only routes.

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Browser                            │
│   Next.js App (React, Tailwind, Framer Motion, Monaco/Prism.js)    │
└──────────────────┬──────────────────────────────┬───────────────────┘
                   │ HTTPS/REST                    │ WebSocket (Realtime)
                   ▼                               ▼
┌─────────────────────────────┐    ┌──────────────────────────────────┐
│   Next.js API Routes        │    │   Supabase Realtime              │
│   (Vercel Serverless/Edge)  │    │   (Analytics Feed, /admin only)  │
└──────────────┬──────────────┘    └──────────────────────────────────┘
               │ Supabase Client (service key, server-side only)
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     Supabase (PostgreSQL + Auth + Storage)           │
│                                                                      │
│   Tables: components, code_variants, analytics_events, admin_users   │
│   Auth: Supabase Auth (admin-only, email+password)                   │
│   Storage: (V2 — component thumbnail images)                         │
└──────────────────────────────────────────────────────────────────────┘
```

### 6.2 Frontend Stack

| Technology             | Version                    | Purpose                                                                                                            |
| ---------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Next.js**            | 14.x (App Router)          | Core React framework, file-based routing, SSR/ISR/SSG, API routes, Edge Middleware                                 |
| **TypeScript**         | 5.x                        | Type safety across the entire codebase                                                                             |
| **Tailwind CSS**       | 3.x                        | Utility-first styling. Custom theme tokens defined in `tailwind.config.ts` to match the ApexUI flat color palette. |
| **Framer Motion**      | 11.x                       | Declarative animations for panel collapse, bottom sheet, overlay entrance. Respects `prefers-reduced-motion`.      |
| **Monaco Editor**      | via `@monaco-editor/react` | Full-featured code display with syntax highlighting, line numbers, and read-only mode. Loaded with dynamic import. |
| **Prism.js**           | 1.x                        | Lightweight fallback syntax highlighter for mobile views where Monaco is overkill.                                 |
| **Recharts**           | 2.x                        | Admin dashboard chart library. Headless-enough to fully re-style per ApexUI design system.                         |
| **Supabase JS Client** | 2.x                        | Database queries, authentication, Realtime subscriptions                                                           |
| **Zustand**            | 4.x                        | Lightweight client-side state management for customizer state, panel collapse state, active component selection    |
| **cmdk**               | 1.x                        | Headless Command K overlay primitive, fully restyled with ApexUI design tokens                                     |
| **date-fns**           | 3.x                        | Date range manipulation for analytics dashboard filters                                                            |

### 6.3 Backend Stack

| Technology                  | Version               | Purpose                                                                 |
| --------------------------- | --------------------- | ----------------------------------------------------------------------- |
| **Supabase**                | Managed               | PostgreSQL database, Auth, Realtime, Edge Functions, Row Level Security |
| **PostgreSQL**              | 15.x (via Supabase)   | Primary relational database                                             |
| **Supabase Edge Functions** | Deno-based            | Rate-limited analytics ingestion endpoint (`/functions/v1/track-copy`)  |
| **Next.js API Routes**      | App Router `route.ts` | Server-side data fetching for admin routes, code variant retrieval      |
| **Vercel**                  | Latest                | Hosting, CDN, Serverless Functions, Edge Middleware for auth guard      |

### 6.4 Developer Tooling

| Tool                               | Purpose                                                             |
| ---------------------------------- | ------------------------------------------------------------------- |
| **ESLint + `eslint-config-next`**  | Linting                                                             |
| **Prettier**                       | Code formatting                                                     |
| **Husky + lint-staged**            | Pre-commit hooks to enforce lint/format                             |
| **Playwright**                     | End-to-end testing (critical user flows: copy, search, mobile view) |
| **Vitest + React Testing Library** | Unit and component tests                                            |
| **Storybook** (V2)                 | Component documentation                                             |

### 6.5 Code Storage Strategy

Component source codes SHALL NOT be hardcoded in the frontend. The retrieval strategy is as follows:

- **Primary Source (Database):** Each component's code variants are stored as `text` fields in the `code_variants` table in Supabase PostgreSQL. This is the authoritative source.
- **Fetching:** When a user opens a Component Detail View, the Next.js page (`page.tsx`) fetches the code variants server-side using `generateStaticParams` (for pre-rendered top 20 components) or on-demand via a Next.js API route (`/api/components/[slug]/code`).
- **Caching:** Fetched code is cached at the Vercel CDN edge with a `Cache-Control: s-maxage=3600, stale-while-revalidate=86400` header. Database queries by admin-authorized clients can trigger an on-demand ISR revalidation via `revalidatePath`.
- **Template Interpolation:** Code stored in the database uses `{{param_name}}` placeholders for customizable values. The client-side customizer engine substitutes these placeholders with current customizer values before displaying the code in the editor. The raw template (with placeholders) is never shown to the user.
- **GitHub API (Optional, V2):** For components that are actively maintained in a GitHub repository, a background sync job (Supabase Edge Function cron) can pull the latest code from the GitHub Contents API and upsert it into the database, ensuring the displayed code stays in sync with the repository.

---

## 7. High-Level Database Schema

> All tables are created in Supabase PostgreSQL. Row Level Security (RLS) is enabled on all tables. Timestamps use `TIMESTAMPTZ` and default to `now()`.

### 7.1 Table: `components`

Stores the top-level record for each UI component in the library.

```sql
CREATE TABLE components (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,               -- URL-safe identifier, e.g. "data-table-default"
  name          TEXT NOT NULL,                       -- Display name, e.g. "Data Table — Default"
  description   TEXT,                               -- Short description for search + meta
  category      TEXT NOT NULL,                       -- e.g. "table", "chart", "navigation", "bento"
  tags          TEXT[] DEFAULT '{}',                 -- e.g. ["sortable", "paginated", "react"]
  bento_size    TEXT NOT NULL DEFAULT '1x1',         -- "1x1", "2x1", "2x2"
  copy_count    INTEGER NOT NULL DEFAULT 0,          -- Denormalized counter, updated async
  is_published  BOOLEAN NOT NULL DEFAULT false,      -- Draft/publish gate
  sort_order    INTEGER DEFAULT 100,                 -- Controls display ordering in gallery
  customizer_schema  JSONB,                          -- Defines available customizer controls
  random_data_schema JSONB,                          -- Defines fake data structure for Live Data Toggle
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Full-text search vector (auto-maintained by trigger)
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' ||
    coalesce(description, '') || ' ' ||
    coalesce(category, '') || ' ' ||
    coalesce(array_to_string(tags, ' '), ''))
  ) STORED
);

CREATE INDEX idx_components_category ON components (category);
CREATE INDEX idx_components_slug ON components (slug);
CREATE INDEX idx_components_search ON components USING GIN (search_vector);
CREATE INDEX idx_components_published ON components (is_published, sort_order);
```

**`customizer_schema` JSONB structure example:**

```json
{
  "params": [
    {
      "key": "row_height",
      "label": "Row Height (px)",
      "type": "range_slider",
      "default": 48,
      "min": 36,
      "max": 72,
      "step": 4
    },
    {
      "key": "accent_color",
      "label": "Accent Color",
      "type": "color_picker",
      "default": "#A31D1D",
      "palette": ["#A31D1D", "#1D3A8A", "#1D8A4A", "#8A6A1D"]
    },
    {
      "key": "show_pagination",
      "label": "Show Pagination",
      "type": "toggle_switch",
      "default": true
    }
  ]
}
```

---

### 7.2 Table: `code_variants`

Stores the source code for each supported framework variant of a component. A component can have multiple variants (HTML, Tailwind, React/TSX).

```sql
CREATE TABLE code_variants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id    UUID NOT NULL REFERENCES components (id) ON DELETE CASCADE,
  language        TEXT NOT NULL,                      -- "html" | "tailwind" | "react-tsx"
  code_template   TEXT NOT NULL,                      -- Source code with {{param_name}} placeholders
  display_order   INTEGER NOT NULL DEFAULT 0,         -- Order of language tabs
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_component_language UNIQUE (component_id, language)
);

CREATE INDEX idx_code_variants_component ON code_variants (component_id);
```

---

### 7.3 Table: `analytics_events`

An append-only event log. No updates or deletes are performed on this table; it is insert-only.

```sql
CREATE TABLE analytics_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      TEXT NOT NULL,                      -- "copy" | "page_view" | "search"
  component_id    UUID REFERENCES components (id) ON DELETE SET NULL,
  component_slug  TEXT,                               -- Denormalized for query performance after deletion
  language        TEXT,                               -- For "copy" events: "html" | "tailwind" | "react-tsx"
  route           TEXT,                               -- For "page_view" events: the URL path
  search_query    TEXT,                               -- For "search" events: the query string
  session_id      TEXT,                               -- Anonymous session identifier (UUID stored client-side)
  ip_hash         TEXT,                               -- SHA-256 hash of IP address (never raw IP)
  user_agent_hash TEXT,                               -- SHA-256 hash of User-Agent for bot filtering
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partition by month for query performance at scale (V2 migration)
CREATE INDEX idx_analytics_event_type ON analytics_events (event_type, created_at DESC);
CREATE INDEX idx_analytics_component ON analytics_events (component_id, event_type, created_at DESC);
CREATE INDEX idx_analytics_created ON analytics_events (created_at DESC);
```

---

### 7.4 Table: `admin_users`

Manages admin access. Linked to Supabase Auth `auth.users`.

```sql
CREATE TABLE admin_users (
  id              UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name    TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 7.5 Row Level Security (RLS) Policies

```sql
-- components: public read (published only), admin write
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published components"
  ON components FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can do all on components"
  ON components FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- code_variants: public read, admin write
ALTER TABLE code_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read code variants"
  ON code_variants FOR SELECT
  USING (true);

CREATE POLICY "Admins can do all on code_variants"
  ON code_variants FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- analytics_events: no public read, insert via service-role Edge Function only
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to analytics"
  ON analytics_events FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- admin_users: no public access
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins only"
  ON admin_users FOR ALL
  USING (auth.uid() = id);
```

---

### 7.6 Key Database Views (for Analytics Dashboard)

```sql
-- Aggregated daily copy counts
CREATE VIEW vw_daily_copy_events AS
SELECT
  DATE_TRUNC('day', created_at) AS event_date,
  COUNT(*) AS copy_count
FROM analytics_events
WHERE event_type = 'copy'
GROUP BY 1
ORDER BY 1;

-- Top components by copy count (last 30 days)
CREATE VIEW vw_top_components AS
SELECT
  component_slug,
  COUNT(*) AS copy_count,
  language
FROM analytics_events
WHERE event_type = 'copy'
  AND created_at >= now() - INTERVAL '30 days'
GROUP BY component_slug, language
ORDER BY copy_count DESC
LIMIT 10;
```

---

## 8. UI/UX & Design System Guidelines

### 8.1 Core Design Philosophy

ApexUI adheres to a **strict Dark Flat Design** aesthetic. This is a non-negotiable constraint — not a stylistic preference — for the entire application. The goal is visual precision: every pixel of the UI must communicate structure through solid form, not light effects.

**Prohibited visual properties** (zero exceptions in production builds):

- `box-shadow` on any UI element (structural or component-level)
- `backdrop-filter: blur(...)` anywhere
- `background: radial-gradient(...)` or `background: linear-gradient(...)` on any UI surface
- `border-radius > 4px` on structural containers (cards, panels, modals). 4px is the maximum for any element.
- Glassmorphism patterns (`rgba` backgrounds over blurred backdrops)

Depth and hierarchy are achieved exclusively through:

- **Solid matte layering** (distinct `background-color` values on nested surfaces).
- **Crisp 1px solid borders** (`border: 1px solid #262930`).
- **High typographic weight contrast** (thin labels vs. bold values).
- **Flat color state transitions** (hover/active/focus trigger instant color property changes, not shadow additions).

---

### 8.2 Color Palette

All color tokens are defined as CSS custom properties in `globals.css` and as values in `tailwind.config.ts`.

| Token Name             | Hex Value | CSS Variable             | Tailwind Class   | Usage                                |
| ---------------------- | --------- | ------------------------ | ---------------- | ------------------------------------ |
| `color-bg-base`        | `#0D0E11` | `--color-bg-base`        | `bg-base`        | Page background (Layer 0)            |
| `color-bg-card`        | `#16181D` | `--color-bg-card`        | `bg-card`        | Cards, panels, containers (Layer 1)  |
| `color-bg-code`        | `#1E222B` | `--color-bg-code`        | `bg-code`        | Code panels, sub-surfaces (Layer 2)  |
| `color-border`         | `#262930` | `--color-border`         | `border-default` | All borders, dividers, grid lines    |
| `color-accent`         | `#A31D1D` | `--color-accent`         | `accent`         | Active states, CTA, focus borders    |
| `color-accent-dim`     | `#7A1515` | `--color-accent-dim`     | `accent-dim`     | Pressed/active state of Accent       |
| `color-text-primary`   | `#F5F2EB` | `--color-text-primary`   | `text-primary`   | Body copy, code text, primary labels |
| `color-text-secondary` | `#9A9BA0` | `--color-text-secondary` | `text-secondary` | Subtitles, metadata, timestamps      |
| `color-text-muted`     | `#5A5C63` | `--color-text-muted`     | `text-muted`     | Placeholder text, disabled states    |

**Tailwind configuration excerpt:**

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        base: "#0D0E11",
        card: "#16181D",
        code: "#1E222B",
        "border-default": "#262930",
        accent: "#A31D1D",
        "accent-dim": "#7A1515",
        primary: "#F5F2EB",
        secondary: "#9A9BA0",
        muted: "#5A5C63",
      },
      borderRadius: {
        DEFAULT: "2px", // All elements default to 2px max
        sm: "2px",
        md: "4px",
        lg: "4px", // Cap at 4px — no pill or full-round shapes
      },
    },
  },
};
```

---

### 8.3 Typography

| Element             | Font                               | Weight       | Size             | Color           |
| ------------------- | ---------------------------------- | ------------ | ---------------- | --------------- |
| Page Title (H1)     | `JetBrains Mono` / `Space Grotesk` | 700 Bold     | 2.25rem (36px)   | `#F5F2EB`       |
| Section Title (H2)  | `Space Grotesk`                    | 600 SemiBold | 1.5rem (24px)    | `#F5F2EB`       |
| Component Name (H3) | `Space Grotesk`                    | 500 Medium   | 1.125rem (18px)  | `#F5F2EB`       |
| Body Copy           | `Inter`                            | 400 Regular  | 0.875rem (14px)  | `#9A9BA0`       |
| Code / Monospace    | `JetBrains Mono`                   | 400 Regular  | 0.8125rem (13px) | `#F5F2EB`       |
| Label / Tag         | `Inter`                            | 500 Medium   | 0.75rem (12px)   | `#9A9BA0`       |
| Button Text         | `Inter`                            | 600 SemiBold | 0.875rem (14px)  | Varies by state |

Font loading strategy: Next.js `next/font/google` with `display: 'swap'` to avoid FOIT (Flash of Invisible Text). Fonts are subsetted to the Latin character set only.

---

### 8.4 Interaction States

All hover/focus/active state transitions SHALL be instant (`transition-duration: 80ms` maximum) or use CSS `transition` limited to `border-color`, `background-color`, or `color`. No `box-shadow` transitions.

| Component                | Default State                                             | Hover State                         | Focus State                                       | Active/Pressed State        | Disabled State                                      |
| ------------------------ | --------------------------------------------------------- | ----------------------------------- | ------------------------------------------------- | --------------------------- | --------------------------------------------------- |
| **Primary Button (CTA)** | `bg-accent` text `#F5F2EB` border `accent`                | `bg-accent-dim`                     | `outline: 2px solid #A31D1D; outline-offset: 2px` | `bg-accent-dim` opacity 90% | `bg-card` text `text-muted` border `border-default` |
| **Secondary Button**     | `bg-card` text `text-primary` border `border-default`     | `border-accent` text `text-primary` | `outline: 2px solid #A31D1D`                      | `bg-code`                   | `opacity: 40%`                                      |
| **Bento Grid Cell**      | `border: 1px solid #262930`                               | `border: 1px solid #A31D1D`         | N/A (not focusable as a whole)                    | N/A                         | N/A                                                 |
| **Text Input / Search**  | `bg-code` border `border-default`                         | `border: 1px solid #9A9BA0`         | `border: 1px solid #A31D1D`                       | N/A                         | `opacity: 40%`                                      |
| **Tab (Code/Customize)** | `bg-transparent` text `text-secondary` border-bottom none | `text-primary`                      | `outline: 2px solid #A31D1D`                      | N/A                         | N/A                                                 |
| **Active Tab**           | `text-primary` `border-bottom: 2px solid #A31D1D`         | Same                                | Same                                              | N/A                         | N/A                                                 |
| **Nav Item (Panel A)**   | `text-secondary` no bg                                    | `bg-code` `text-primary`            | `outline: 2px solid #A31D1D`                      | N/A                         | N/A                                                 |
| **Active Nav Item**      | `text-primary` `border-left: 2px solid #A31D1D` `bg-code` | Same                                | Same                                              | N/A                         | N/A                                                 |

---

### 8.5 Component Micro-Interaction Specifications

**Panel Collapse (Framer Motion):**

```typescript
// Framer Motion variant for panel collapse
const panelVariants = {
  open: { width: "240px", opacity: 1 },
  closed: { width: "0px", opacity: 0 },
};
// transition: { duration: 0.2, ease: 'easeInOut' }
// layout: true on sibling panels to reflow smoothly
```

**Mobile Bottom Sheet (Framer Motion):**

```typescript
const sheetVariants = {
  hidden: { y: "100%" },
  visible: { y: "0%" },
};
// transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] }
// drag: 'y', dragConstraints: { top: 0 }, dragElastic: 0.2
// onDragEnd: close if velocity.y > 500 or offset.y > 200
```

**Command K Overlay (Framer Motion):**

```typescript
const overlayVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1.0 },
};
// transition: { duration: 0.12, ease: 'easeOut' }
// AnimatePresence wraps the overlay for exit animation
```

**Copy Button Feedback:**

- No toast notifications. State is entirely contained within the button.
- Use a `useState` with a `setTimeout` reset at 1500ms.
- Button transitions: `idle` → `copied` → `idle` (text-only change, no layout shift).

---

### 8.6 Iconography

- Icon library: **Lucide React** (v0.383.0) — consistent stroke-based icons that complement the flat design.
- All icons SHALL use `stroke-width={1.5}` for a precise, lightweight aesthetic.
- Icon size: `16px` (inline), `20px` (button icons), `24px` (standalone).
- No filled/solid icons unless explicitly required for state indication.

---

### 8.7 Code Editor Theme

The Monaco Editor SHALL use a custom theme registered at runtime:

```typescript
// Token colors match ApexUI flat design language
monaco.editor.defineTheme("apexui-dark", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "A31D1D", fontStyle: "bold" },
    { token: "string", foreground: "C8A97E" },
    { token: "number", foreground: "A8C4E0" },
    { token: "comment", foreground: "5A5C63", fontStyle: "italic" },
    { token: "tag", foreground: "D4A5A5" },
    { token: "attribute.name", foreground: "9A9BA0" },
    { token: "attribute.value", foreground: "C8A97E" },
  ],
  colors: {
    "editor.background": "#1E222B",
    "editor.foreground": "#F5F2EB",
    "editor.lineHighlightBackground": "#262930",
    "editorLineNumber.foreground": "#5A5C63",
    "editorGutter.background": "#1E222B",
    "editor.selectionBackground": "#A31D1D40",
    "editorCursor.foreground": "#A31D1D",
    "scrollbarSlider.background": "#26293080",
    "scrollbarSlider.hoverBackground": "#A31D1D80",
  },
});
```

---

## 9. Future Roadmap — V2+

The following features are explicitly out of scope for MVP v1.0 and are documented here for future planning.

### 9.1 V2.0 — Community Contributions

- **User Authentication (Public):** Allow developers to create accounts and submit their own components for review.
- **Component Submission Pipeline:** A submission form (with code paste or GitHub URL import) feeding a moderation queue visible in the admin dashboard.
- **Voting & Favorites:** Authenticated users can upvote components and save favorites to a personal collection.
- **Comments / Community Notes:** A flat discussion thread anchored to each component for community Q&A.

### 9.2 V2.0 — GitHub API Sync

- A Supabase Edge Function cron job (scheduled daily) that queries the GitHub Contents API for a configured repository.
- Any changes to component files in the repository are automatically pulled and upserted into the `code_variants` table.
- A `github_sha` field on `code_variants` tracks the last synced commit to enable delta-only updates.

### 9.3 V2.0 — CLI Tool (`create-apex-component`)

- An `npx` CLI tool that allows developers to pull any ApexUI component directly into their local project with a single command:
  ```bash
  npx create-apex-component data-table-default --variant=react-tsx --output=./src/components
  ```
- The CLI queries the ApexUI public API (`/api/components/[slug]/code`), substitutes default parameter values, and writes the file to the specified path.

### 9.4 V2.1 — Figma Plugin

- A Figma plugin that renders ApexUI component previews directly in Figma, allowing designers to inspect and copy the corresponding code without leaving their design tool.

### 9.5 V2.1 — AI Component Generator

- An integrated AI prompt interface (using the Anthropic API) allowing users to describe a UI component in natural language.
- The AI generates a component adhering to ApexUI design system tokens (dark flat palette, no gradients, 1px borders).
- The generated component is displayed in the Live Preview Canvas and can be copied or saved as a new community submission.

### 9.6 V2.2 — Component Playground (Multi-Component Canvas)

- A free-form drag-and-drop canvas where users can place multiple ApexUI components side-by-side.
- Useful for designing and previewing full page layouts using library primitives before committing to code.

### 9.7 V2.2 — Theming Engine

- A global theme editor allowing users to override the ApexUI base color palette (accent color, background, border color).
- All components in the gallery re-render with the custom theme applied.
- Themes can be exported as a Tailwind config override file.

### 9.8 V2.3 — Subscription Tier & Premium Components

- A freemium model: the base library remains fully open-source and free.
- A curated set of "Premium" components (advanced data grids, complex dashboard layouts, animated landing sections) are available to subscribers via a Stripe-integrated paid tier.
- Premium component code is not stored in the database in plaintext; it is delivered via a signed, time-limited URL from Supabase Storage.

---

_End of Document — ApexUI PRD v1.0.0_

---

> **Document Control:** This PRD is the authoritative source of truth for the ApexUI v1.0 MVP. Any scope changes, feature modifications, or technical direction shifts must be reflected in this document with a version bump and a dated changelog entry before implementation begins.
