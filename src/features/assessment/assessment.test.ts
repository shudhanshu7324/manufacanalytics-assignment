import { schemaResolver } from '@mantine/form';
import { EMPTY_ASSESSMENT_VALUES } from './constants';
import { sampleAssessment } from './fixtures';
import { assessmentSchema } from './schema';

const firstIssue = (input: unknown) => {
  const result = assessmentSchema.safeParse(input);
  return result.success ? undefined : result.error.issues[0];
};

describe('assessmentSchema', () => {
  describe('age boundary (age is measured on the assessment date)', () => {
    const assessmentDate = '2026-08-07';

    it('accepts a patient who turns 60 exactly on the assessment date', () => {
      const result = assessmentSchema.safeParse({
        ...sampleAssessment,
        assessmentDate,
        dateOfBirth: '1966-08-07',
      });

      expect(result.success).toBe(true);
    });

    it('rejects a patient one day short of 60', () => {
      const result = assessmentSchema.safeParse({
        ...sampleAssessment,
        assessmentDate,
        dateOfBirth: '1966-08-08',
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues).toHaveLength(1);
      expect(result.error?.issues[0]).toMatchObject({
        path: ['dateOfBirth'],
        message: 'This pathway is for patients aged 60 and over',
      });
    });
  });

  it('accepts the sample patient', () => {
    expect(assessmentSchema.safeParse(sampleAssessment).success).toBe(true);
  });

  it.each([
    ['mrn', { mrn: 'MRN-4821' }],
    ['patientName', { patientName: 'S' }],
    ['mobility', { mobility: 'crutches' }],
    ['barthelIndex', { barthelIndex: 82 }],
    ['barthelIndex', { barthelIndex: 105 }],
    ['pharmacistReviewRequested', { medicationCount: 5, pharmacistReviewRequested: false }],
    ['followUpDate', { followUpDate: sampleAssessment.assessmentDate }],
    ['consentObtained', { consentObtained: false }],
  ])('rejects an invalid change with the error on the right field (%s)', (field, change) => {
    expect(firstIssue({ ...sampleAssessment, ...change })?.path).toEqual([field]);
  });

  it.each([
    ['Barthel Index 0', { barthelIndex: 0 }],
    ['Barthel Index 100', { barthelIndex: 100 }],
    ['4 medications without pharmacist review', { medicationCount: 4 }],
  ])('accepts %s', (_name, change) => {
    expect(assessmentSchema.safeParse({ ...sampleAssessment, ...change }).success).toBe(true);
  });

  it('does not round or clamp a Barthel Index that is not a multiple of 5', () => {
    const issue = firstIssue({ ...sampleAssessment, barthelIndex: 82 });

    expect(issue?.message).toBe('Barthel Index is scored in steps of 5');
  });
});

describe('empty form through the Mantine schema resolver', () => {
  it('reports exactly one error per required field, with no cross-field noise', () => {
    const errors = schemaResolver(assessmentSchema, { sync: true })(EMPTY_ASSESSMENT_VALUES);

    expect(Object.keys(errors).sort()).toEqual(
      [
        'assessmentDate',
        'barthelIndex',
        'consentObtained',
        'dateOfBirth',
        'followUpDate',
        'medicationCount',
        'mobility',
        'mrn',
        'patientName',
      ].sort()
    );
  });
});
