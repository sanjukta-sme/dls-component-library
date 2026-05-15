import { useState } from 'react'
import type { AccordionProps } from './Accordion.types'

export function Accordion({
  items,
  shouldAllowMultipleExpanded = true,
}: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const isOpen = prev.includes(id)

      if (isOpen) {
        return prev.filter((itemId) => itemId !== id)
      }

      if (shouldAllowMultipleExpanded) {
        return [...prev, id]
      }

      return [id]
    })
  }

  return (
    <div>
      {items.map((item) => {
        const isOpen = expandedIds.includes(item.id)

        return (
          <div key={item.id}>
            <button onClick={() => toggleItem(item.id)}>
              {item.title}
            </button>

            {isOpen && (
              <div>
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}