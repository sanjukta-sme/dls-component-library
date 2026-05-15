import type { ReactNode, CSSProperties } from 'react'

export interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
}

/**
 * Slot names available for className-only overrides.
 * For full { className, style } control per slot, use AccordionSlotProps.
 *
 * @example
 * <Accordion slots={{ root: 'my-accordion', item: 'my-accordion__item' }} />
 */
export interface AccordionSlots {
  /** Root container wrapping all items */
  root?: string
  /** Wrapper div rendered around each accordion item */
  item?: string
  /** The trigger button inside each item header */
  header?: string
  /** The content region shown when an item is expanded */
  content?: string
}

/**
 * Per-slot styling overrides that accept both className and inline style.
 * Takes precedence over the same slot in `slots` when both are provided.
 *
 * @example
 * <Accordion
 *   slotProps={{
 *     header: { className: 'my-trigger', style: { fontWeight: 600 } },
 *     content: { className: 'my-panel' },
 *   }}
 * />
 */
export interface AccordionSlotProps {
  root?: { className?: string; style?: CSSProperties }
  item?: { className?: string; style?: CSSProperties }
  header?: { className?: string; style?: CSSProperties }
  content?: { className?: string; style?: CSSProperties }
}

export interface AccordionProps {
  /**
   * Array of accordion items to render.
   * Each item must have a unique `id`, a `title`, and `content`.
   */
  items: AccordionItem[]

  /**
   * Whether multiple panels can be expanded simultaneously.
   * @default true
   */
  shouldAllowMultipleExpanded?: boolean

  /**
   * **Controlled mode.** Array of currently expanded item IDs.
   * When provided, the component delegates all state management to the
   * parent. `onChange` must also be provided to handle updates.
   *
   * Omit this prop entirely to use uncontrolled mode.
   */
  expandedIds?: string[]

  /**
   * Callback fired whenever the expanded set changes.
   * Receives the next array of expanded item IDs.
   *
   * Called in both controlled and uncontrolled modes, so parents can
   * observe changes without owning the state.
   */
  onChange?: (expandedIds: string[]) => void

  /**
   * className applied to the root container element.
   * Shorthand for `slotProps.root.className`.
   * Both can be used together — they are merged.
   */
  className?: string

  /**
   * Inline style applied to the root container element.
   * Shorthand for `slotProps.root.style`.
   * Takes precedence over `slotProps.root.style` if both are set.
   */
  style?: CSSProperties

  /**
   * Slot-based className overrides for individual elements.
   * Use this when you only need to apply class names.
   * For inline styles per slot, use `slotProps` instead.
   */
  slots?: AccordionSlots

  /**
   * Slot-based `{ className, style }` overrides for individual elements.
   * More expressive than `slots` — use this when you need per-slot styles
   * or when merging class names alongside inline styles.
   *
   * When both `slots.header` and `slotProps.header.className` are set,
   * both class names are applied (slots first, slotProps second).
   */
  slotProps?: AccordionSlotProps
}