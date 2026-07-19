# ApexUI — Design Vault

An open-source, interactive UI Component Library and Design Vault. Browse, customize, and copy production-grade UI components built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Flat Design Gallery** — Bento-grid layout with category filtering and ISR
- **3-Panel Detail View** — Live preview canvas, syntax-highlighted code editor (Monaco), and interactive customizer
- **Interactive Customizer** — Adjust colors, sizes, toggles, and more with instant preview + code updates
- **Mobile View** — Responsive catalog and bottom-sheet code viewer
- **Live Data Toggle** — Generate random table/chart data on the fly
- **Command+K Search** — Global full-text search across all components
- **Admin Dashboard** — Auth-gated analytics with charts and real-time copy feed
- **Copy Analytics** — Every copy event tracked for usage insights

## Tech Stack

| Layer       | Technology                                                  |
| ----------- | ----------------------------------------------------------- |
| Framework   | [Next.js 14](https://nextjs.org/) (App Router)              |
| Styling     | [Tailwind CSS 3](https://tailwindcss.com/)                  |
| Database    | [Supabase](https://supabase.com/) (PostgreSQL)              |
| Animation   | [Framer Motion 11](https://www.framer.com/motion/)          |
| Code Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| Charts      | [Recharts](https://recharts.org/)                           |
| Fonts       | Inter, Space Grotesk, JetBrains Mono                        |

## Quick Start

```bash
git clone https://github.com/j0nsss/ApexUi.git
cd ApexUi
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:

| Variable                        | Description               |
| ------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service_role key |

### Database Setup

Run the migration and seed script:

```bash
# Apply schema
npx supabase db push

# Seed 20+ components
npx tsx scripts/seed.ts
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Tests

```bash
npm test              # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)
```

## Deployment

Deploy to Vercel with the following environment variables set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Edge Functions require manual deployment:

```bash
npx supabase functions deploy track-copy --project-ref xajzpnqxvepcnehrwtnw
```

## Project Structure

```
app/
  page.tsx              # Gallery (ISR)
  components/[slug]/    # Detail view
  admin/                # Admin dashboard
  api/                  # API routes
components/ui/          # Shared UI primitives
lib/                    # Utilities, types, store
hooks/                  # React hooks
supabase/migrations/    # DB schema
scripts/seed.ts         # Seed data
```

## License

MIT — see [LICENSE](LICENSE).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
