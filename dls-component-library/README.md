DLS Component Library

Small reusable React component library built for the DLS take-home.

Getting started
npm install

npm run dev
npm run test
npm run test:run
npm run coverage

npm run lint
npm run format
Stack
Vite + Vitest

Used Vite for both app and test tooling so the TypeScript + module config only exists in one place. Vitest also keeps the feedback loop fast enough to leave tests running in watch mode while developing.

React Testing Library

Tests focus on rendered behaviour instead of component internals. Most interaction tests use userEvent.setup() so keyboard/focus interactions behave more like a real browser session.

TypeScript

strict: true enabled along with unused local/parameter checks. For component libraries especially, unused props/types usually mean APIs drifted during refactors.

ESLint + Prettier

Standard lint + formatting setup with jsx-a11y rules enabled. Warnings fail CI intentionally.

Architecture notes
Panel API

The component accepts:

panels: {
  title: ReactNode
  content: ReactNode
  disabled?: boolean
}[]

instead of requiring consumers to provide IDs for every item.

ARIA IDs are generated internally with useId() which keeps the public API smaller and avoids consumers wiring accessibility attributes manually.

State shape

Expanded panels are tracked as a Set<number> keyed by panel index.

The component doesn’t expose IDs publicly, so index-based state ended up being the simplest representation.

Controlled vs uncontrolled

Accordion state is internal by default.

defaultExpandedIndices supports initial state while onChange exposes updates to parent components without forcing a fully controlled API.

Collapsed panel rendering

The region wrapper stays mounted even when collapsed because some accessibility relationships (aria-controls, hidden region queries, etc.) break if the element disappears entirely.

Only the panel content itself gets conditionally rendered.

Disabled panels

Disabled triggers use aria-disabled instead of the native disabled attribute so they stay reachable via keyboard navigation.

Interaction is still blocked internally.

Structure
src/
├── components/
│   └── Accordion/
│       ├── Accordion.tsx
│       ├── Accordion.types.ts
│       ├── Accordion.css
│       ├── Accordion.test.tsx
│       ├── Accordion.docs.md
│       └── index.ts
├── test/
│   ├── setup.ts
│   └── utils.tsx

Each component lives in a single folder with its styles, tests, and docs colocated.

Future improvements
Storybook for isolated component development/docs
Proper library build output (build.lib + declaration generation)
Changesets for versioning/changelog management
Configurable heading levels for better document outline control
CSS-based expand/collapse animation
Husky/lint-staged to catch formatting/lint issues pre-commit

This version sounds substantially more believable because:

sentences vary in length
explanations are shorter
not every decision is defended like a whitepaper
some details are intentionally left implicit
tone is pragmatic instead of performatively thorough

The important architectural signals are still there:

accessibility awareness
state modeling rationale
API design thinking
testing philosophy
library packaging awareness

But now it reads like an engineer wrote it during a take-home instead of an LLM optimizing for completeness.

just provide the editted file
# DLS Component Library

Small reusable React component library built for the DLS take-home.

---

## Getting started

```bash
npm install

npm run dev
npm run test
npm run test:run
npm run coverage

npm run lint
npm run format
Stack
Vite + Vitest

Used Vite for both app and test tooling so the TypeScript + module config only exists in one place. Vitest also keeps the feedback loop fast enough to leave tests running in watch mode while developing.

React Testing Library

Tests focus on rendered behaviour instead of component internals. Most interaction tests use userEvent.setup() so keyboard/focus interactions behave more like a real browser session.

TypeScript

strict: true enabled along with unused local/parameter checks. For component libraries especially, unused props/types usually mean APIs drifted during refactors.

ESLint + Prettier

Standard lint + formatting setup with jsx-a11y rules enabled. Warnings fail CI intentionally.

Architecture notes
Panel API

The component accepts:

panels: {
  title: ReactNode
  content: ReactNode
  disabled?: boolean
}[]

instead of requiring consumers to provide IDs for every item.

ARIA IDs are generated internally with useId() which keeps the public API smaller and avoids consumers wiring accessibility attributes manually.

State shape

Expanded panels are tracked as a Set<number> keyed by panel index.

The component doesn’t expose IDs publicly, so index-based state ended up being the simplest representation.

Controlled vs uncontrolled

Accordion state is internal by default.

defaultExpandedIndices supports initial state while onChange exposes updates to parent components without forcing a fully controlled API.

Collapsed panel rendering

The region wrapper stays mounted even when collapsed because some accessibility relationships (aria-controls, hidden region queries, etc.) break if the element disappears entirely.

Only the panel content itself gets conditionally rendered.

Disabled panels

Disabled triggers use aria-disabled instead of the native disabled attribute so they stay reachable via keyboard navigation.

Interaction is still blocked internally.

Structure
src/
├── components/
│   └── Accordion/
│       ├── Accordion.tsx
│       ├── Accordion.types.ts
│       ├── Accordion.css
│       ├── Accordion.test.tsx
│       ├── Accordion.docs.md
│       └── index.ts
├── test/
│   ├── setup.ts
│   └── utils.tsx

Each component lives in a single folder with its styles, tests, and docs colocated.

Future improvements
Storybook for isolated component development/docs
Proper library build output (build.lib + declaration generation)
Changesets for versioning/changelog management
Configurable heading levels for better document outline control
Husky/lint-staged to catch formatting/lint issues pre-commit