import dayjs from 'dayjs';
import { Checkbox, NumberInput, Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { MOBILITY_OPTIONS } from '../constants';
import type { AssessmentFormApi } from '../types';

interface AssessmentFormFieldsProps {
  form: AssessmentFormApi;
}

export function AssessmentFormFields({ form }: AssessmentFormFieldsProps) {
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <>
      <TextInput
        label="Medical record number"
        placeholder="MRN-004821"
        withAsterisk
        {...form.getInputProps('mrn')}
      />
      <TextInput label="Patient name" withAsterisk {...form.getInputProps('patientName')} />
      <DateInput
        label="Date of birth"
        placeholder="Select date of birth"
        withAsterisk
        {...form.getInputProps('dateOfBirth')}
      />
      <DateInput
        label="Assessment date"
        placeholder="Select assessment date"
        maxDate={today}
        withAsterisk
        {...form.getInputProps('assessmentDate')}
      />
      <Select
        label="Mobility"
        placeholder="Select mobility status"
        data={MOBILITY_OPTIONS}
        allowDeselect={false}
        withAsterisk
        {...form.getInputProps('mobility')}
      />
      {/* clampBehavior="none": an out-of-range score must be rejected, never silently clamped. */}
      <NumberInput
        label="Barthel Index"
        step={5}
        min={0}
        max={100}
        clampBehavior="none"
        withAsterisk
        {...form.getInputProps('barthelIndex')}
      />
      <NumberInput
        label="Regular medications"
        min={0}
        max={30}
        clampBehavior="none"
        withAsterisk
        {...form.getInputProps('medicationCount')}
      />
      <Checkbox
        label="Pharmacist review requested"
        {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
      />
      <DateInput
        label="Next review date"
        placeholder="Select next review date"
        withAsterisk
        {...form.getInputProps('followUpDate')}
      />
      <Checkbox
        label="Patient or representative has given consent"
        {...form.getInputProps('consentObtained', { type: 'checkbox' })}
      />
    </>
  );
}
