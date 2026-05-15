import { useState, useCallback, useMemo, useRef } from 'react'
import type { AccordionProps } from './Accordion.types'

/**
 * Merges class names, filtering out falsy values.
 * Kept internal — not worth pulling in clsx for four call sites.
 */
function cx(...classes: (string | undefined | null | false)[]): string | undefined {
  const merged = classes.filter(Boolean).join(' ')
  return merged || undefined
}

export function Accordion({
  items,
  shouldAllowMultipleExpanded = true,
  expandedIds: controlledExpandedIds,
  onChange,
  className,
  style,
  slots,
  slotProps,
}: AccordionProps) {
  // Uncontrolled mode: manage state internally
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState<string[]>([])

  // Determine if component is in controlled mode
  const isControlled = controlledExpandedIds !== undefined

  // Use controlled or uncontrolled state accordingly
  const expandedIds = isControlled ? controlledExpandedIds : uncontrolledExpandedIds

  // Refs for button elements to manage focus during keyboard navigation
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Memoized toggle handler
  const toggleItem = useCallback(
    (id: string) => {
      const isOpen = expandedIds.includes(id)

      let nextExpandedIds: string[]

      if (isOpen) {
        // Close the panel
        nextExpandedIds = expandedIds.filter((itemId) => itemId !== id)
      } else {
        // Open the panel
        if (shouldAllowMultipleExpanded) {
          // Multiple panels allowed: add to existing
          nextExpandedIds = [...expandedIds, id]
        } else {
          // Single panel only: replace with new
          nextExpandedIds = [id]
        }
      }

      // Update state and fire callback
      if (isControlled) {
        // Controlled mode: let parent handle state
        onChange?.(nextExpandedIds)
      } else {
        // Uncontrolled mode: update internal state
        setUncontrolledExpandedIds(nextExpandedIds)
        onChange?.(nextExpandedIds)
      }
    },
    [expandedIds, shouldAllowMultipleExpanded, isControlled, onChange]
  )

  // Memoize expanded state map for performance
  const expandedMap = useMemo(() => {
    const map = new Map<string, boolean>()
    expandedIds.forEach((id) => map.set(id, true))
    return map
  }, [expandedIds])

  // Generate deterministic, stable IDs for headers and panels
  const getButtonId = (id: string) => `accordion-button-${id}`
  const getPanelId = (id: string) => `accordion-panel-${id}`

  // Handle keyboard interactions
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex = index
      let shouldMove = false

      switch (e.key) {
        case 'Enter':
        case ' ':
          // Toggle panel on Enter or Space
          e.preventDefault()
          toggleItem(items[index].id)
          break
        case 'ArrowUp':
          // Move focus to previous header (wraps around to last)
          e.preventDefault()
          nextIndex = index > 0 ? index - 1 : items.length - 1
          shouldMove = true
          break
        case 'ArrowDown':
          // Move focus to next header (wraps around to first)
          e.preventDefault()
          nextIndex = index < items.length - 1 ? index + 1 : 0
          shouldMove = true
          break
        case 'Home':
          // Jump to first header
          e.preventDefault()
          nextIndex = 0
          shouldMove = true
          break
        case 'End':
          // Jump to last header
          e.preventDefault()
          nextIndex = items.length - 1
          shouldMove = true
          break
        default:
          break
      }

      // Set focus to the next button if navigation occurred
      if (shouldMove && buttonRefs.current[nextIndex]) {
        buttonRefs.current[nextIndex]?.focus()
      }
    },
    [items, toggleItem]
  )

  return (
    <div
      className={cx(slots?.root, slotProps?.root?.className, className)}
      // Root-level `style` is applied last so it wins over slotProps.root.style.
      // This mirrors how className behaves: the more specific prop takes precedence.
      style={slotProps?.root?.style || style
        ? { ...slotProps?.root?.style, ...style }
        : undefined}
    >
      {items.map((item, index) => {
        const isOpen = expandedMap.has(item.id)
        const buttonId = getButtonId(item.id)
        const panelId = getPanelId(item.id)

        return (
          <div
            key={item.id}
            className={cx(slots?.item, slotProps?.item?.className)}
            style={slotProps?.item?.style}
          >
            <button
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              id={buttonId}
              onClick={() => toggleItem(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={cx(slots?.header, slotProps?.header?.className)}
              style={slotProps?.header?.style}
            >
              {item.title}
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cx(slots?.content, slotProps?.content?.className)}
                style={slotProps?.content?.style}
              >
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}