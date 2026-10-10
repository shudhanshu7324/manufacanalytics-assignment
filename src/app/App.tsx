import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { Container, MantineProvider, Title } from '@mantine/core';
import { AssessmentForm } from '../features/assessment/components/AssessmentForm';
import { SAVE_DELAY_MS } from '../features/assessment/constants';
import { theme } from '../theme';

// There is no backend: a save is just a delay.
const simulateSave = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, SAVE_DELAY_MS);
  });

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Container size="sm" py="xl">
        <Title order={1} mb="lg">
          Geriatric Care Assessment
        </Title>
        <AssessmentForm onSave={simulateSave} />
      </Container>
    </MantineProvider>
  );
}
