import type { ReactNode, CSSProperties } from 'react'

export interface AccordionPanel {
  title: ReactNode
  content: ReactNode
  /**
   * Disables the panel trigger. The button remains focusable so keyboard
   * users know the panel exists — it just cannot be toggled.
   * Uses aria-disabled rather than the disabled attribute for this reason.
   */
  disabled?: boolean
}

export interface AccordionSlots {
  root?: string
  item?: string
  header?: string
  content?: string
}

export interface AccordionSlotProps {
  root?: { className?: string; style?: CSSProperties }
  item?: { className?: string; style?: CSSProperties }
  header?: { className?: string; style?: CSSProperties }
  content?: { className?: string; style?: CSSProperties }
}

export interface AccordionProps {
  /** Array of panels to render. Order determines render order and keyboard navigation sequence. */
  panels: AccordionPanel[]

  /**
   * Indices of panels that should be open on first render.
   * Only applies in uncontrolled mode — ignored if expandedIndices is provided.
   * @default []
   */
  defaultExpandedIndices?: number[]

  /**
   * When false, opening any panel closes all others.
   * @default true
   */
  shouldAllowMultipleExpanded?: boolean

  /**
   * Callback fired when the expanded set changes.
   * Receives the indices of all currently expanded panels.
   */
  onChange?: (expandedIndices: number[]) => void

  /** className on the root container. Merged with slotProps.root.className. */
  className?: string

  /** Inline style on the root container. Wins over slotProps.root.style. */
  style?: CSSProperties

  /** Per-element className overrides. */
  slots?: AccordionSlots

  /** Per-element { className, style } overrides. */
  slotProps?: AccordionSlotProps
}