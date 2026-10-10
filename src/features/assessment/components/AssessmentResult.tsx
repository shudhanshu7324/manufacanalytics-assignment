import { Alert, Code } from '@mantine/core';
import type { Assessment } from '../schema';

interface AssessmentResultProps {
  assessment: Assessment;
}

export function AssessmentResult({ assessment }: AssessmentResultProps) {
  return (
    <Alert color="green" title="Assessment saved" mt="lg">
      <Code block>{JSON.stringify(assessment, null, 2)}</Code>
    </Alert>
  );
}
