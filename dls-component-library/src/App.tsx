import { Accordion } from './components/Accordion'
import './components/Accordion/Accordion.css'

const faqPanels = [
  {
    title: 'What goes into an accessible accordion?',
    content:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  },
  {
    title: 'When should I use single-expand vs multi-expand?',
    content:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  },
  {
    title: 'Can I bring my own styles?',
    content:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  },
]

const settingsPanels = [
  {
    title: 'Notifications',
    content:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  },
  {
    title: 'Privacy',
    content:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  },
  {
    title: 'Billing',
    content:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  },
]

const chevron = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const withChevron = (panels: typeof faqPanels) =>
  panels.map((p) => ({
    ...p,
    title: (
      <>
        {p.title}
        {chevron}
      </>
    ),
  }))

const slots = {
  root: 'accordion',
  item: 'accordion__item',
  header: 'accordion__trigger',
  content: 'accordion__content',
}

export default function App() {
  return (
    <div className="page">
      <div className="page__inner">

        <header className="page__header">
          <span className="page__badge">DLS Component Library</span>
          <h1 className="page__title">Accordion</h1>
        </header>

        <section className="page__section">
          <p className="page__label">Multi expand</p>
          <Accordion panels={withChevron(faqPanels)} shouldAllowMultipleExpanded slots={slots} />
        </section>

        <section className="page__section">
          <p className="page__label">Single expand</p>
          <Accordion panels={withChevron(settingsPanels)} shouldAllowMultipleExpanded={false} slots={slots} />
        </section>

      </div>
    </div>
  )
}