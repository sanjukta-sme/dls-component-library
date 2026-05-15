import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'

export function renderWithUser(ui: ReactElement) {
  const user = userEvent.setup()
  return { user, ...render(ui) }
}