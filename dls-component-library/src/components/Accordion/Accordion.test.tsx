import { describe, test, expect, vi as vitest } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from './Accordion'
import type { AccordionItem } from './Accordion.types'

// Helper to render with user event utilities
async function renderWithUser(component: React.ReactElement) {
  const user = userEvent.setup()
  const result = render(component)
  return { ...result, user }
}

// Test data
const testItems: AccordionItem[] = [
  {
    id: '1',
    title: 'Panel 1',
    content: 'Content for panel one',
  },
  {
    id: '2',
    title: 'Panel 2',
    content: 'Content for panel two',
  },
  {
    id: '3',
    title: 'Panel 3',
    content: 'Content for panel three',
  },
]

describe('Accordion', () => {
  test('renders accordion with multiple panels', () => {
    render(<Accordion items={testItems} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    expect(screen.queryByText('Content for panel one')).toBeNull()
    expect(screen.queryByText('Content for panel two')).toBeNull()
    expect(screen.queryByText('Content for panel three')).toBeNull()
  })

  test('shows content for the clicked panel and hides the rest', async () => {
    const { user } = await renderWithUser(<Accordion items={testItems} />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[1])
    expect(screen.getByText('Content for panel two')).toBeVisible()
    expect(screen.queryByText('Content for panel one')).toBeNull()
    expect(screen.queryByText('Content for panel three')).toBeNull()
  })

  test('hides content when an expanded panel is clicked again', async () => {
    const { user } = await renderWithUser(<Accordion items={testItems} />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[2])
    expect(screen.getByText('Content for panel three')).toBeVisible()
    await user.click(buttons[2])
    expect(screen.queryByText('Content for panel three')).toBeNull()
  })

  test('can expand multiple panels at the same time by default', async () => {
    const { user } = await renderWithUser(<Accordion items={testItems} />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])
    await user.click(buttons[2])
    expect(screen.getByText('Content for panel one')).toBeVisible()
    expect(screen.queryByText('Content for panel two')).toBeNull()
    expect(screen.getByText('Content for panel three')).toBeVisible()
  })

  describe('when shouldAllowMultipleExpanded is false', () => {
    test('only one panel is visible at a time', async () => {
      const { user } = await renderWithUser(
        <Accordion items={testItems} shouldAllowMultipleExpanded={false} />
      )
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0])
      expect(screen.getByText('Content for panel one')).toBeVisible()
      await user.click(buttons[2])
      expect(screen.getByText('Content for panel three')).toBeVisible()
      expect(screen.queryByText('Content for panel one')).toBeNull()
    })
  })

  describe('accessibility', () => {
    test('each button has aria-controls pointing to its content region', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      // Expand all panels first so regions are rendered
      await user.click(buttons[0])
      await user.click(buttons[1])
      await user.click(buttons[2])
      
      // Now verify aria-controls relationships
      buttons.forEach((button) => {
        const controlsId = button.getAttribute('aria-controls')
        expect(controlsId).toBeTruthy()
        expect(document.getElementById(controlsId!)).toBeInTheDocument()
      })
    })

    test('content regions have aria-labelledby pointing back to their header', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      // Expand all panels first so regions are rendered
      await user.click(buttons[0])
      await user.click(buttons[1])
      await user.click(buttons[2])
      const regions = screen.getAllByRole('region')
      regions.forEach((region) => {
        const labelledBy = region.getAttribute('aria-labelledby')
        expect(labelledBy).toBeTruthy()
        expect(document.getElementById(labelledBy!)).toBeInTheDocument()
      })
    })

    test('buttons have aria-expanded attribute', () => {
      render(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        const expanded = button.getAttribute('aria-expanded')
        expect(expanded).toBe('false')
      })
    })

    test('aria-expanded updates when panel is expanded', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      const firstButton = buttons[0]
      expect(firstButton.getAttribute('aria-expanded')).toBe('false')
      await user.click(firstButton)
      expect(firstButton.getAttribute('aria-expanded')).toBe('true')
    })

    test('aria-expanded returns to false when panel is collapsed', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      const firstButton = buttons[0]
      await user.click(firstButton)
      expect(firstButton.getAttribute('aria-expanded')).toBe('true')
      await user.click(firstButton)
      expect(firstButton.getAttribute('aria-expanded')).toBe('false')
    })
  })

  describe('keyboard navigation', () => {
    test('Space key toggles the focused panel', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      const firstButton = buttons[0]
      firstButton.focus()
      await user.keyboard(' ')
      expect(screen.getByText('Content for panel one')).toBeVisible()
      await user.keyboard(' ')
      expect(screen.queryByText('Content for panel one')).toBeNull()
    })

    test('Enter key toggles the focused panel', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      const firstButton = buttons[0]
      firstButton.focus()
      await user.keyboard('{Enter}')
      expect(screen.getByText('Content for panel one')).toBeVisible()
      await user.keyboard('{Enter}')
      expect(screen.queryByText('Content for panel one')).toBeNull()
    })

    test('ArrowDown moves focus to next panel', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      buttons[0].focus()
      expect(document.activeElement).toBe(buttons[0])
      await user.keyboard('{ArrowDown}')
      expect(document.activeElement).toBe(buttons[1])
    })

    test('ArrowUp moves focus to previous panel', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      buttons[1].focus()
      expect(document.activeElement).toBe(buttons[1])
      await user.keyboard('{ArrowUp}')
      expect(document.activeElement).toBe(buttons[0])
    })

    test('ArrowDown wraps to first panel from last', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      buttons[2].focus()
      await user.keyboard('{ArrowDown}')
      expect(document.activeElement).toBe(buttons[0])
    })

    test('ArrowUp wraps to last panel from first', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      buttons[0].focus()
      await user.keyboard('{ArrowUp}')
      expect(document.activeElement).toBe(buttons[2])
    })

    test('Home key moves focus to first panel', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      buttons[2].focus()
      await user.keyboard('{Home}')
      expect(document.activeElement).toBe(buttons[0])
    })

    test('End key moves focus to last panel', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      buttons[0].focus()
      await user.keyboard('{End}')
      expect(document.activeElement).toBe(buttons[2])
    })
  })

  describe('controlled mode', () => {
    test('expandedIds prop controls which panels are open', () => {
      render(<Accordion items={testItems} expandedIds={['2']} />)
      expect(screen.queryByText('Content for panel one')).toBeNull()
      expect(screen.getByText('Content for panel two')).toBeVisible()
      expect(screen.queryByText('Content for panel three')).toBeNull()
    })

    test('onChange is called when panel is clicked in controlled mode', async () => {
      const onChange = vitest.fn()
      const { user } = await renderWithUser(
        <Accordion items={testItems} expandedIds={[]} onChange={onChange} />
      )
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0])
      expect(onChange).toHaveBeenCalledWith(['1'])
    })

    test('onChange receives next expanded IDs', async () => {
      const onChange = vitest.fn()
      const { user } = await renderWithUser(
        <Accordion
          items={testItems}
          expandedIds={['1']}
          onChange={onChange}
          shouldAllowMultipleExpanded={true}
        />
      )
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[1])
      expect(onChange).toHaveBeenCalledWith(['1', '2'])
    })
  })

  describe('uncontrolled mode', () => {
    test('onChange is called in uncontrolled mode', async () => {
      const onChange = vitest.fn()
      const { user } = await renderWithUser(
        <Accordion items={testItems} onChange={onChange} />
      )
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0])
      expect(onChange).toHaveBeenCalledWith(['1'])
    })

    test('state is managed internally in uncontrolled mode', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0])
      expect(screen.getByText('Content for panel one')).toBeVisible()
      await user.click(buttons[1])
      expect(screen.getByText('Content for panel one')).toBeVisible()
      expect(screen.getByText('Content for panel two')).toBeVisible()
    })
  })

  describe('deterministic IDs', () => {
    test('buttons have predictable IDs based on item IDs', () => {
      render(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons[0].id).toBe('accordion-button-1')
      expect(buttons[1].id).toBe('accordion-button-2')
      expect(buttons[2].id).toBe('accordion-button-3')
    })

    test('regions have predictable IDs based on item IDs', async () => {
      const { user } = await renderWithUser(<Accordion items={testItems} />)
      const buttons = screen.getAllByRole('button')
      // Expand all panels first so regions are rendered
      await user.click(buttons[0])
      await user.click(buttons[1])
      await user.click(buttons[2])
      const regions = screen.getAllByRole('region')
      expect(regions[0].id).toBe('accordion-panel-1')
      expect(regions[1].id).toBe('accordion-panel-2')
      expect(regions[2].id).toBe('accordion-panel-3')
    })

    test('IDs are stable across re-renders', async () => {
      const { user, rerender } = await renderWithUser(
        <Accordion items={testItems} />
      )
      const firstButtonId = screen.getAllByRole('button')[0].id
      await user.click(screen.getAllByRole('button')[0])
      rerender(<Accordion items={testItems} />)
      expect(screen.getAllByRole('button')[0].id).toBe(firstButtonId)
    })
  })
})
