import type { UseFormReturnType } from '@mantine/form';
import type { Assessment } from './schema';

/** Fields whose empty state is `null` (Mantine's DateInput and Select clear to `null`). */
type NullableWhenEmpty = 'dateOfBirth' | 'assessmentDate' | 'followUpDate' | 'mobility';

/**
 * What the inputs hold while the nurse is typing. Derived from `Assessment` so the two
 * cannot drift: it only widens each field to allow its empty state. Only the resolver
 * turns this into a valid `Assessment`.
 */
export type AssessmentFormValues = {
  [Field in keyof Assessment]: Field extends NullableWhenEmpty
    ? Assessment[Field] | null
    : Assessment[Field] extends number
      ? number | string // NumberInput reports '' when empty and partial text while typing
      : Assessment[Field] extends boolean
        ? boolean
        : Assessment[Field];
};

/** Form API in the shape the form components receive: raw input values, parsed `Assessment` output. */
export type AssessmentFormApi = UseFormReturnType<AssessmentFormValues, Assessment>;
