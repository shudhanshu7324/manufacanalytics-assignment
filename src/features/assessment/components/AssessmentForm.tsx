import { useState } from 'react';
import { Button, Fieldset, Group, Paper, Stack } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { EMPTY_ASSESSMENT_VALUES } from '../constants';
import { sampleAssessment } from '../fixtures';
import { assessmentSchema, type Assessment } from '../schema';
import type { AssessmentFormValues } from '../types';
import { AssessmentFormFields } from './AssessmentFormFields';
import { AssessmentResult } from './AssessmentResult';

interface AssessmentFormProps {
  onSave: (assessment: Assessment) => Promise<void>;
}

export function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [savedAssessment, setSavedAssessment] = useState<Assessment | null>(null);

  const form = useForm<AssessmentFormValues, Assessment>({
    initialValues: EMPTY_ASSESSMENT_VALUES,
    validate: schemaResolver(assessmentSchema, { sync: true }),
    validateInputOnBlur: true,
    // Runs only after validation has passed, so parse() cannot throw here. Using it (rather
    // than a cast) means the submit handler receives exactly what Zod returned.
    transformValues: (values) => assessmentSchema.parse(values),
    // Editing after a save makes the shown result stale, so hide it.
    onValuesChange: () => setSavedAssessment(null),
  });

  const handleSubmit = async (assessment: Assessment) => {
    await onSave(assessment);
    setSavedAssessment(assessment);
  };

  const loadSamplePatient = () => {
    form.setValues(sampleAssessment);
    form.clearErrors();
  };

  return (
    <>
      <Paper withBorder shadow="sm" p="lg" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          {/* A disabled fieldset blocks edits and Enter-key resubmits while the save is running. */}
          <Fieldset disabled={form.submitting} variant="unstyled">
            <Stack gap="md">
              <AssessmentFormFields form={form} />
              <Group justify="space-between" mt="sm">
                <Button variant="default" onClick={loadSamplePatient}>
                  Load sample patient
                </Button>
                <Button type="submit" loading={form.submitting}>
                  Save assessment
                </Button>
              </Group>
            </Stack>
          </Fieldset>
        </form>
      </Paper>
      {savedAssessment && <AssessmentResult assessment={savedAssessment} />}
    </>
  );
}
