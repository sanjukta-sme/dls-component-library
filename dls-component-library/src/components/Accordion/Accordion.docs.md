# Accordion

A composable, accessible accordion component supporting both controlled and uncontrolled usage patterns. Built to the [WAI-ARIA Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).

---

## Basic usage

The simplest case. All panels start collapsed. Multiple panels can be open at once by default.

```tsx
import { Accordion } from '@/components/Accordion'

const items = [
  { id: 'shipping', title: 'Shipping', content: 'We ship worldwide in 3–5 days.' },
  { id: 'returns',  title: 'Returns',  content: 'Free returns within 30 days.'  },
  { id: 'support',  title: 'Support',  content: 'Available Monday–Friday 9–5.'  },
]

export function FAQ() {
  return <Accordion items={items} />
}
```

---

## Single-expand mode

Pass `shouldAllowMultipleExpanded={false}` when only one panel should be open at a time. Opening a new panel automatically closes the previous one.

```tsx
<Accordion items={items} shouldAllowMultipleExpanded={false} />
```

---

## Uncontrolled mode

Default behaviour. The component owns its state internally. Use `onChange` to observe changes without taking control of them — useful for analytics or syncing to a URL.

```tsx
<Accordion
  items={items}
  onChange={(openIds) => {
    // openIds is the full list of currently expanded item IDs
    console.log('expanded:', openIds)
  }}
/>
```

> **Note:** There is currently no `defaultExpandedIds` prop. All panels start collapsed in uncontrolled mode. Pre-opening specific panels on mount is planned for the next release — use controlled mode in the meantime if you need it.

---

## Controlled mode

Pass `expandedIds` to take full control of expanded state. The component will not update itself — you are responsible for calling `setState` inside `onChange`.

```tsx
function ControlledExample() {
  const [openIds, setOpenIds] = useState<string[]>(['shipping'])

  return (
    <Accordion
      items={items}
      expandedIds={openIds}
      onChange={setOpenIds}
    />
  )
}
```

You can also drive it from something other than local state — a URL param, a reducer, a server response — and the component will reflect whatever `expandedIds` you pass.

```tsx
// Derived from URL: ?open=shipping,returns
const openIds = searchParams.get('open')?.split(',') ?? []

<Accordion
  items={items}
  expandedIds={openIds}
  onChange={(next) => setSearchParams({ open: next.join(',') })}
/>
```

---

## Styling

The component ships with zero visual styles. It exposes a two-level styling API so you can apply styles however your project is set up — whether that's CSS modules, Tailwind, CSS-in-JS, or plain inline styles.

### Root-level className and style

The simplest way to style the outer container.

```tsx
<Accordion
  items={items}
  className="my-accordion"
  style={{ borderRadius: 8 }}
/>
```

### slots — className per element

When you need class names on specific internal elements without inline styles.

```tsx
<Accordion
  items={items}
  slots={{
    root:    'accordion',
    item:    'accordion__item',
    header:  'accordion__trigger',
    content: 'accordion__panel',
  }}
/>
```

Works cleanly with BEM, CSS Modules, or any utility class system:

```tsx
import styles from './FAQ.module.css'

<Accordion
  items={items}
  slots={{
    root:    styles.accordion,
    item:    styles.item,
    header:  styles.trigger,
    content: styles.panel,
  }}
/>
```

### slotProps — className and style per element

When you need both class names and inline styles on specific elements, or when you want to co-locate both in one prop.

```tsx
<Accordion
  items={items}
  slotProps={{
    root:    { className: 'accordion', style: { maxWidth: 640 } },
    header:  { className: 'accordion__trigger', style: { fontWeight: 600 } },
    content: { className: 'accordion__panel', style: { padding: '12px 16px' } },
  }}
/>
```

### Mixing slots and slotProps

Both can be used together. Class names from `slots` and `slotProps` are merged — `slots` first, `slotProps` second — so `slotProps` values appear later in the class string.

```tsx
<Accordion
  items={items}
  className="faq"                        // applied to root
  slots={{ header: 'base-trigger' }}     // always on every header
  slotProps={{
    header: { className: 'faq__trigger' } // appended after base-trigger
  }}
/>
```

### With Tailwind

```tsx
<Accordion
  items={items}
  slots={{
    root:    'divide-y divide-gray-200 rounded-lg border border-gray-200',
    item:    'overflow-hidden',
    header:  'flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-left hover:bg-gray-50',
    content: 'px-4 pb-4 text-sm text-gray-600',
  }}
/>
```

---

## Accessibility

### ARIA attributes

| Element | Attribute | Value |
|---|---|---|
| Trigger button | `aria-expanded` | `true` when panel is open, `false` when closed |
| Trigger button | `aria-controls` | ID of the associated content panel |
| Content panel | `role` | `region` |
| Content panel | `aria-labelledby` | ID of the associated trigger button |

IDs are derived from item `id` values using a stable, deterministic format (`accordion-button-{id}`, `accordion-panel-{id}`). Avoid special characters in `id` values.

### Keyboard navigation

| Key | Behaviour |
|---|---|
| `Enter` / `Space` | Toggle the focused panel |
| `ArrowDown` | Move focus to the next trigger (wraps to first) |
| `ArrowUp` | Move focus to the previous trigger (wraps to last) |
| `Home` | Move focus to the first trigger |
| `End` | Move focus to the last trigger |

### Screen reader notes

- Each trigger button is wrapped in an `<h3>`. This places the accordion within the document heading structure, which screen reader users rely on for landmark navigation. If your page's heading hierarchy requires a different level, this is a known limitation — configurable heading levels are planned.
- Collapsed panels are removed from the DOM entirely. This means screen readers will not read collapsed content, which is the expected WAI-ARIA behaviour. It also means `aria-controls` points to an element that does not exist when the panel is closed. Most browser/AT combinations tolerate this gracefully, but it is a deviation from the spec and is tracked as a known issue.

---

## API reference

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `AccordionItem[]` | — | **Required.** Array of panels to render. Each item needs a unique `id`. |
| `shouldAllowMultipleExpanded` | `boolean` | `true` | When `false`, opening any panel closes all others. |
| `expandedIds` | `string[]` | — | Controlled mode. Array of item IDs that are currently open. |
| `onChange` | `(ids: string[]) => void` | — | Fired when the expanded set changes. Receives the next full array of open IDs. |
| `className` | `string` | — | Class applied to the root container. Merged with `slotProps.root.className`. |
| `style` | `CSSProperties` | — | Inline style on the root container. Takes precedence over `slotProps.root.style`. |
| `slots` | `AccordionSlots` | — | Per-element className overrides (shorthand for className-only styling). |
| `slotProps` | `AccordionSlotProps` | — | Per-element `{ className, style }` overrides. |

### AccordionItem

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier. Used to generate ARIA IDs and track expanded state. |
| `title` | `ReactNode` | Content rendered inside the trigger button. |
| `content` | `ReactNode` | Content rendered inside the panel when expanded. |

### AccordionSlots

| Slot | Element | Description |
|---|---|---|
| `root` | `<div>` | Outer wrapper for the entire accordion. |
| `item` | `<div>` | Wrapper rendered around each individual item. |
| `header` | `<button>` | The trigger button. |
| `content` | `<div role="region">` | The expandable content panel. |

### AccordionSlotProps

Same slot keys as `AccordionSlots`, but each accepts `{ className?: string; style?: CSSProperties }` instead of a plain string.

---

## Edge cases

### Empty items array

Renders an empty root div. No errors thrown.

```tsx
<Accordion items={[]} /> // → <div></div>
```

### Single item

Works correctly. Keyboard wrapping (ArrowUp on the first item, ArrowDown on the last) correctly wraps to the same item.

```tsx
<Accordion items={[{ id: 'only', title: 'One item', content: 'Content' }]} />
```

### Duplicate IDs

IDs must be unique within a single Accordion instance. Duplicate IDs will cause both `expandedMap` lookups and ARIA attribute values to behave incorrectly. The component does not validate this in production — consider adding a check in development builds if this is a real risk in your data pipeline.

### IDs with special characters

Avoid spaces, `#`, `.`, or other CSS selector characters in `id` values. These get interpolated directly into `aria-controls` and `aria-labelledby` attribute values and into the DOM `id` attributes, where invalid characters can break `document.getElementById` lookups.

### Switching between controlled and uncontrolled

React will warn if `expandedIds` changes from `undefined` to a defined value (or vice versa) at runtime. Decide which mode you need upfront and don't switch — this is consistent with how React handles `<input value>` vs `<input defaultValue>`.

### Controlled mode with no onChange

The component will open and close visually based on `expandedIds`, but user interactions will have no effect since there's nothing to update the prop. Always provide `onChange` in controlled mode.