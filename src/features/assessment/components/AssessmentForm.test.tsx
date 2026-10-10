import { act, render, screen, userEvent } from '@test-utils';
import { sampleAssessment } from '../fixtures';
import { AssessmentForm } from './AssessmentForm';

const setup = () => {
  const onSave = vi.fn<(assessment: unknown) => Promise<void>>().mockResolvedValue(undefined);
  const user = userEvent.setup();
  render(<AssessmentForm onSave={onSave} />);
  return { onSave, user };
};

describe('AssessmentForm', () => {
  it('saves the sample patient with the values Zod parsed', async () => {
    const { onSave, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Load sample patient' }));
    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Assessment saved');
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(sampleAssessment);
  });

  it('does not save and shows the error under the field when consent is missing', async () => {
    const { onSave, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Load sample patient' }));
    await user.click(
      screen.getByRole('checkbox', { name: 'Patient or representative has given consent' })
    );
    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    expect(
      await screen.findByText('Consent must be obtained before the assessment can be saved')
    ).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('stays quiet until a field is blurred, then reports only that field', async () => {
    const { user } = setup();

    expect(screen.queryByText('Must look like MRN-004821')).not.toBeInTheDocument();

    await user.click(screen.getByRole('textbox', { name: /Medical record number/ }));
    await user.tab();

    expect(await screen.findByText('Must look like MRN-004821')).toBeInTheDocument();
    expect(
      screen.queryByText('Patient name must be at least 2 characters')
    ).not.toBeInTheDocument();
  });

  it('blocks duplicate submits while saving and hides the result once the form is edited', async () => {
    let finishSave = () => {};
    const onSave = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishSave = resolve;
        })
    );
    const user = userEvent.setup();
    render(<AssessmentForm onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Load sample patient' }));
    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    const saveButton = screen.getByRole('button', { name: 'Save assessment' });
    expect(saveButton).toBeDisabled();
    await user.click(saveButton);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await act(async () => {
      finishSave();
    });
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: /Patient name/ }), 'x');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('rejects an out-of-range Barthel Index instead of clamping it', async () => {
    const { user } = setup();
    const barthelIndex = screen.getByRole('textbox', { name: /Barthel Index/ });

    await user.type(barthelIndex, '105');
    await user.tab();

    expect(await screen.findByText('Barthel Index ranges from 0 to 100')).toBeInTheDocument();
    expect(barthelIndex).toHaveValue('105');
  });
});
