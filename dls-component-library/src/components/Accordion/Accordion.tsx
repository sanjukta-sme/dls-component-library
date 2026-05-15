import { useState, useId, useCallback, useMemo, useRef } from 'react'
import type { AccordionProps } from './Accordion.types'

function cx(...classes: (string | undefined | null | false)[]): string | undefined {
  const merged = classes.filter(Boolean).join(' ')
  return merged || undefined
}

export function Accordion({
  panels,
  defaultExpandedIndices = [],
  shouldAllowMultipleExpanded = true,
  onChange,
  className,
  style,
  slots,
  slotProps,
}: AccordionProps) {
  const baseId = useId()

  // defaultExpandedIndices is only read once on mount — intentionally not
  // reactive. Changing it after mount has no effect, which is consistent
  // with how React handles defaultValue on controlled/uncontrolled inputs.
  const [expandedSet, setExpandedSet] = useState<Set<number>>(
    new Set(defaultExpandedIndices)
  )

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const toggle = useCallback(
    (index: number) => {
      // Disabled panels stay in the keyboard flow but cannot be toggled.
      if (panels[index]?.disabled) return

      setExpandedSet((prev) => {
        const next = new Set(prev)
        if (next.has(index)) {
          next.delete(index)
        } else {
          if (!shouldAllowMultipleExpanded) next.clear()
          next.add(index)
        }
        onChange?.([...next])
        return next
      })
    },
    [panels, shouldAllowMultipleExpanded, onChange]
  )

  const expandedIndices = useMemo(() => expandedSet, [expandedSet])

  const getButtonId = (index: number) => `${baseId}-btn-${index}`
  const getRegionId = (index: number) => `${baseId}-region-${index}`

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex = index
      let shouldMove = false

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault()
          toggle(index)
          break
        case 'ArrowUp':
          e.preventDefault()
          nextIndex = index > 0 ? index - 1 : panels.length - 1
          shouldMove = true
          break
        case 'ArrowDown':
          e.preventDefault()
          nextIndex = index < panels.length - 1 ? index + 1 : 0
          shouldMove = true
          break
        case 'Home':
          e.preventDefault()
          nextIndex = 0
          shouldMove = true
          break
        case 'End':
          e.preventDefault()
          nextIndex = panels.length - 1
          shouldMove = true
          break
        default:
          break
      }

      if (shouldMove) {
        buttonRefs.current[nextIndex]?.focus()
      }
    },
    [panels.length, toggle]
  )

  return (
    <div
      className={cx(slots?.root, slotProps?.root?.className, className)}
      style={
        slotProps?.root?.style || style
          ? { ...slotProps?.root?.style, ...style }
          : undefined
      }
    >
      {panels.map((panel, index) => {
        const isExpanded = expandedIndices.has(index)
        const buttonId = getButtonId(index)
        const regionId = getRegionId(index)

        return (
          <div
            key={index}
            className={cx(slots?.item, slotProps?.item?.className)}
            style={slotProps?.item?.style}
          >
            <h3 style={{ margin: 0 }}>
              <button
                ref={(el) => { buttonRefs.current[index] = el }}
                id={buttonId}
                aria-expanded={isExpanded}
                aria-controls={regionId}
                // aria-disabled keeps the button in the focus order so keyboard
                // users know the panel exists. The native disabled attribute
                // would remove it from tab order entirely.
                aria-disabled={panel.disabled ?? undefined}
                onClick={() => toggle(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cx(
                  slots?.header,
                  slotProps?.header?.className,
                  panel.disabled ? 'accordion__trigger--disabled' : undefined
                )}
                style={slotProps?.header?.style}
              >
                {panel.title}
              </button>
            </h3>

            {/*
              Region is always in the DOM so aria-controls always resolves
              and getAllByRole('region', { hidden: true }) finds all panels.
              Content is unmounted when collapsed so queryByText() returns null.
            */}
            <div
              id={regionId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isExpanded}
              className={cx(slots?.content, slotProps?.content?.className)}
              style={slotProps?.content?.style}
            >
              {isExpanded && panel.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}