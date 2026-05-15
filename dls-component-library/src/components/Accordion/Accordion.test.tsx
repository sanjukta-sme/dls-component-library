import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderWithUser } from '../../test/utils'
import { Accordion } from './Accordion'

const panels = [
  { title: 'Panel one',   content: 'Content for panel one'   },
  { title: 'Panel two',   content: 'Content for panel two'   },
  { title: 'Panel three', content: 'Content for panel three' },
]

// ─── Existing tests ───────────────────────────────────────────────────────────

describe('Accordion', () => {
  test('renders accordion with multiple panels', () => {
    render(<Accordion panels={panels} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.queryByText('Content for panel one')).toBeNull()
    expect(screen.queryByText('Content for panel two')).toBeNull()
    expect(screen.queryByText('Content for panel three')).toBeNull()
  })

  test('shows content for the clicked panel and hides the rest', async () => {
    const { user } = renderWithUser(<Accordion panels={panels} />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[1])
    expect(screen.getByText('Content for panel two')).toBeVisible()
    expect(screen.queryByText('Content for panel one')).toBeNull()
    expect(screen.queryByText('Content for panel three')).toBeNull()
  })

  test('hides content when an expanded panel is clicked again', async () => {
    const { user } = renderWithUser(<Accordion panels={panels} />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[2])
    expect(screen.getByText('Content for panel three')).toBeVisible()
    await user.click(buttons[2])
    expect(screen.queryByText('Content for panel three')).toBeNull()
  })

  test('can expand multiple panels at the same time by default', async () => {
    const { user } = renderWithUser(<Accordion panels={panels} />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])
    await user.click(buttons[2])
    expect(screen.getByText('Content for panel one')).toBeVisible()
    expect(screen.queryByText('Content for panel two')).toBeNull()
    expect(screen.getByText('Content for panel three')).toBeVisible()
  })

  describe('when shouldAllowMultipleExpanded is false', () => {
    test('only one panel is visible at a time', async () => {
      const { user } = renderWithUser(
        <Accordion panels={panels} shouldAllowMultipleExpanded={false} />
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
    test('each button has aria-controls pointing to its content region', () => {
      render(<Accordion panels={panels} />)
      screen.getAllByRole('button').forEach((btn) => {
        const id = btn.getAttribute('aria-controls')
        expect(id).toBeTruthy()
        expect(document.getElementById(id!)).toBeInTheDocument()
      })
    })

    test('content regions have aria-labelledby pointing back to their header', () => {
      render(<Accordion panels={panels} />)
      screen.getAllByRole('region', { hidden: true }).forEach((region) => {
        const id = region.getAttribute('aria-labelledby')
        expect(id).toBeTruthy()
        expect(document.getElementById(id!)).toBeInTheDocument()
      })
    })
  })

  // ─── Keyboard navigation ─────────────────────────────────────────────────

  describe('keyboard navigation', () => {
    // Focus the first button before each keyboard test so every test
    // starts from a known, consistent position.
    async function setup() {
      const result = renderWithUser(<Accordion panels={panels} />)
      const buttons = screen.getAllByRole('button')
      buttons[0].focus()
      return { ...result, buttons }
    }

    describe('ArrowDown', () => {
      test('moves focus to the next button', async () => {
        const { user, buttons } = await setup()
        await user.keyboard('{ArrowDown}')
        expect(buttons[1]).toHaveFocus()
      })

      test('wraps focus from the last button back to the first', async () => {
        const { user, buttons } = await setup()
        buttons[panels.length - 1].focus()
        await user.keyboard('{ArrowDown}')
        expect(buttons[0]).toHaveFocus()
      })
    })

    describe('ArrowUp', () => {
      test('moves focus to the previous button', async () => {
        const { user, buttons } = await setup()
        buttons[1].focus()
        await user.keyboard('{ArrowUp}')
        expect(buttons[0]).toHaveFocus()
      })

      test('wraps focus from the first button back to the last', async () => {
        const { user, buttons } = await setup()
        await user.keyboard('{ArrowUp}')
        expect(buttons[panels.length - 1]).toHaveFocus()
      })
    })

    describe('Home and End', () => {
      test('Home moves focus to the first button regardless of position', async () => {
        const { user, buttons } = await setup()
        buttons[2].focus()
        await user.keyboard('{Home}')
        expect(buttons[0]).toHaveFocus()
      })

      test('End moves focus to the last button regardless of position', async () => {
        const { user, buttons } = await setup()
        await user.keyboard('{End}')
        expect(buttons[panels.length - 1]).toHaveFocus()
      })
    })

    describe('Enter and Space', () => {
      test('Enter expands the focused panel', async () => {
        const { user } = await setup()
        await user.keyboard('{Enter}')
        expect(screen.getByText('Content for panel one')).toBeVisible()
      })

      test('Enter collapses an already expanded panel', async () => {
        const { user } = await setup()
        await user.keyboard('{Enter}')
        expect(screen.getByText('Content for panel one')).toBeVisible()
        await user.keyboard('{Enter}')
        expect(screen.queryByText('Content for panel one')).toBeNull()
      })

      test('Space expands the focused panel', async () => {
        const { user } = await setup()
        await user.keyboard(' ')
        expect(screen.getByText('Content for panel one')).toBeVisible()
      })

      test('Space collapses an already expanded panel', async () => {
        const { user } = await setup()
        await user.keyboard(' ')
        expect(screen.getByText('Content for panel one')).toBeVisible()
        await user.keyboard(' ')
        expect(screen.queryByText('Content for panel one')).toBeNull()
      })
    })

    describe('focus does not affect expanded state', () => {
      test('ArrowDown moves focus without opening panels', async () => {
        const { user } = await setup()
        await user.keyboard('{ArrowDown}')
        expect(screen.queryByText('Content for panel two')).toBeNull()
      })

      test('ArrowUp moves focus without opening panels', async () => {
        const { user, buttons } = await setup()
        buttons[2].focus()
        await user.keyboard('{ArrowUp}')
        expect(screen.queryByText('Content for panel two')).toBeNull()
      })
    })
  })
})