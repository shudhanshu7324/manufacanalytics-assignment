import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { Container, MantineProvider, Title } from '@mantine/core';
import { theme } from '../theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Container size="sm" py="xl">
        <Title order={1}>Geriatric Care Assessment</Title>
      </Container>
    </MantineProvider>
  );
}
