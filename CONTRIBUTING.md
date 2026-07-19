# Contributing to ApexUI

## How to Submit a New Component

### 1. Define the Component Schema

Add an entry to `scripts/seed.ts` with the following structure:

```typescript
{
  slug: "my-component",
  name: "My Component",
  description: "Brief description.",
  category: "table" | "chart" | "navigation" | "bento",
  tags: ["tag1", "tag2"],
  bento_size: "1x1" | "2x1" | "2x2",
  sort_order: 50,
  customizer_schema: {
    params: [
      {
        key: "param_name",
        label: "Display Label",
        type: "range_slider" | "color_picker" | "toggle_switch" | "select_dropdown" | "text_input",
        default: value,
        // type-specific fields:
        min?: number, max?: number, step?: number,
        palette?: string[],
        options?: { label: string; value: string }[],
      },
    ],
  },
  random_data_schema?: {
    // For table: { columns: [...], row_count: { min, max } }
    // For chart: { data_type: "time_series"|"categorical", points: { min, max }, ... }
  },
  variants: [
    {
      language: "html" | "react-tsx" | "tailwind",
      display_order: 1,
      code_template: "...", // use {{param_name}} for customizable values
    },
  ],
}
```

### 2. Code Template Rules

- Use `{{param_name}}` placeholders for any value that should be customizable.
- Parameters match keys defined in `customizer_schema.params` and `random_data_schema`.
- Keep templates self-contained (no external dependencies).
- Use inline styles or Tailwind classes; avoid CSS imports.

### 3. PR Checklist

- [ ] Component is published in `scripts/seed.ts` with all required fields
- [ ] At least 2 code variants (`html`, `react-tsx`) provided
- [ ] Customizer schema includes at minimum one slider, one color picker, and one toggle
- [ ] Tables/charts include a `random_data_schema`
- [ ] Code templates use `{{param_name}}` correctly for all customizable values
- [ ] Lint passes: `npm run lint`
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npm test`

### Design Constraints

- No `box-shadow`, `backdrop-filter: blur`, or gradients on structural surfaces
- `border-radius` max `4px`
- Color palette: base `#0D0E11`, card `#16181D`, code `#1E222B`, border `#262930`, accent `#A31D1D`
- Font: Inter (body), Space Grotesk (headings), JetBrains Mono (code)
