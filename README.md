# Geriatric Care Assessment Form

A one-page form a visiting nurse fills in when assessing an elderly patient at home. Ten fields, validated entirely by the Zod schema supplied with the assignment. All patient data in this repo is invented.

## Tech stack

React 19, TypeScript (strict), Vite (via the template's `vite-plus`), Mantine 9 (`@mantine/core`, `@mantine/form`, `@mantine/dates`), Zod 4, Day.js, Vitest and React Testing Library.

## Prerequisites

- Node.js (see `.node-version`)
- Yarn 4 (`corepack enable` picks up the version from `package.json`)

## Commands

```sh
yarn install      # install dependencies
yarn dev          # start the dev server
yarn vitest       # run the tests
yarn test         # full check: format, lint, stylelint, tests, production build
yarn build        # typecheck and production build into dist/
```

## How it works

- `src/features/assessment/schema.ts` is the assignment's schema, unchanged apart from formatting.
- Validation goes through Mantine's `schemaResolver`. There is no hand-written `validate` object and no rule is repeated in a component.
- It runs on blur (per field) and on submit. Untouched fields stay quiet.
- `Assessment` (from `z.infer`) is the only domain type. `AssessmentFormValues` in `types.ts` is a mapped type derived from it that widens each field to its empty state (`''` for numbers, `null` for dates and mobility), so nothing is declared twice.
- `useForm<AssessmentFormValues, Assessment>` with `transformValues: (v) => assessmentSchema.parse(v)` means the submit handler receives exactly what Zod returned, with no casts. Mantine only calls it after validation has passed, so `parse` cannot throw there.
- A valid submit waits 800 ms (simulated save), disables the whole form and shows the button's loading state, then shows a success `Alert` with the parsed values in a `Code` block. Editing the form afterwards hides the result, so it never describes stale data.
- The mobility options are generated from `MOBILITY`; adding a value to that array adds it to the dropdown.

## Decisions worth knowing about

- **No silent changes to clinical values.** Mantine's `NumberInput` clamps to `min`/`max` on blur by default, which would turn a typed 105 into 100 unseen. Both number inputs use `clampBehavior="none"`, so the schema rejects the value and the nurse sees what they typed.
- **Required fields use `withAsterisk`, not `required`.** The native `required` attribute would let the browser block submit before the schema runs, and the form has `noValidate` so the schema is the single source of truth.
- **Duplicate submits** are prevented by a disabled `<fieldset>` around the controls while saving (it also blocks Enter-key resubmits and edits mid-save).
- **Cross-field errors refresh on their own field's blur or on submit.** Changing the assessment date does not re-validate the date of birth or next review date until they are blurred or the form is submitted.
- **Assessment date `maxDate` is today**, as specified. The given schema has no "not in the future" rule and I did not add one.
- **Template changes:** removed the demo (Welcome, router, `react-router-dom`) since routing is out of scope. The template's only CSS file went with it, which made `stylelint` fail on an empty file set, so the script now has `--allow-empty-input`. No lint, format or TypeScript rules were changed.
- **Tests:** beyond the two required scenarios (age boundary via `safeParse`, load sample then submit) there are focused cases for the rejected/accepted values in the brief, the empty form producing exactly 9 errors, quiet-until-blurred, duplicate-submit prevention, and no clamping.

## Not done / open items

- **Time spent:** _to be filled in by the author, honestly._
- **Deployment:** not deployed yet. `yarn build` produces a static `dist/` that any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages) can serve; there is no routing, so no rewrite rules are needed. The URL goes here once it is live: _pending_.
- **Not checked in a real browser.** Behaviour was verified through the test suite in jsdom; the `maxDate` limit on the assessment date is set but not asserted by a test.
- A failing save has no UI (the simulated save cannot fail). With a real backend this would need an error state.
- The production bundle is about 576 kB (Mantine plus dates); I did not code-split it for a single page.
