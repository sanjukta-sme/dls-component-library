import { Accordion } from './components/Accordion'

export default function App() {
  return (
    <Accordion
      shouldAllowMultipleExpanded={true}
      items={[
        {
          id: '1',
          title: 'Panel 1',
          content: 'Content 1',
        },
        {
          id: '2',
          title: 'Panel 2',
          content: 'Content 2',
        },
        {
          id: '3',
          title: 'Panel 3',
          content: 'Content 3',
        },
      ]}
    />
  )
}