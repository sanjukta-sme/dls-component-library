import type { ReactNode } from 'react'

export interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
}

export interface AccordionProps {
  /**
   * Array of accordion items to render.
   * Each item must have a unique id, title, and content.
   */
  items: AccordionItem[]

  /**
   * Whether multiple panels can be expanded simultaneously.
   * @default true
   */
  shouldAllowMultipleExpanded?: boolean

  /**
   * (Controlled Mode) Array of currently expanded item IDs.
   * When provided, component becomes controlled and onChange becomes required.
   * @optional
   */
  expandedIds?: string[]

  /**
   * Callback fired when the set of expanded items changes.
   * Receives the next array of expanded item IDs.
   * Required when using controlled mode (expandedIds prop).
   * @optional
   */
  onChange?: (expandedIds: string[]) => void
}