---
name: Component Submission
about: Submit a new component for inclusion
title: "Component: "
labels: component
assignees: ""
---

## Component Details

- **Name:**
- **Category:** table / chart / navigation / bento
- **Description:**
- **Bento Size:** 1×1 / 2×1 / 2×2

## Customizer Parameters

List the customizable parameters (sliders, color pickers, toggles, etc.)

## Code Variants

Which languages are included? (html, react-tsx, tailwind, ...)

## Random Data

Does this component support random data generation? If yes, describe the schema.

## Checklist

- [ ] Component added to `scripts/seed.ts`
- [ ] At least 2 code variants provided
- [ ] Customizer schema with min 3 controls
- [ ] Tables/charts include `random_data_schema`
- [ ] `{{param_name}}` placeholders used correctly
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npm test`
