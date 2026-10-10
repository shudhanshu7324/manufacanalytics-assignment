import { MOBILITY } from './schema';
import type { AssessmentFormValues } from './types';

export const SAVE_DELAY_MS = 800;

// Deliberately empty: required numbers start blank so the schema, not a default, decides validity.
export const EMPTY_ASSESSMENT_VALUES: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: null,
  assessmentDate: null,
  mobility: null,
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: null,
  consentObtained: false,
};

// 'home_visit' -> 'Home visit', 'cane' -> 'Cane'
const toReadableLabel = (value: string) => {
  const spaced = value.replace(/[_-]+/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export const MOBILITY_OPTIONS = MOBILITY.map((value) => ({
  value,
  label: toReadableLabel(value),
}));
