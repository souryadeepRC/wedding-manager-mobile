import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput, ChoiceChips } from '@/components';
import { makeStyles } from '@/theme';
import { EVENT_TYPES, GUEST_COUNT, GUEST_RELATION, GUEST_STATUS, NOTES_MAX, TITLE_MAX } from '../guest.constants';
import { guestFormSchema, type GuestForm as GuestFormValues } from '../guest.schema';
import { InviteToggle } from './InviteToggle';
import { Stepper } from './Stepper';

type Props = {
  initialValues: GuestFormValues;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: GuestFormValues) => void;
  onDelete?: () => void;
  deleting?: boolean;
};

const useStyles = makeStyles(t => ({
  form: { flexGrow: 1, gap: t.spacing.xl },
  notes: { minHeight: t.sizes.touch * 2, textAlignVertical: 'top', ...t.typography.body },
  actions: { marginTop: 'auto', gap: t.spacing.sm },
}));

export function GuestForm({ initialValues, submitLabel, submitting, onSubmit, onDelete, deleting }: Props) {
  const styles = useStyles();
  const { control, handleSubmit, formState } = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    mode: 'onChange',
    defaultValues: initialValues,
  });

  return (
    <View style={styles.form}>
      <Controller control={control} name="title" render={({ field, fieldState }) => (
        <AppInput label="Guest or family name" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur}
          placeholder="e.g. Sharma Family" maxLength={TITLE_MAX} autoCapitalize="words" error={fieldState.error?.message} />
      )} />
      <Controller control={control} name="connection" render={({ field }) => (
        <ChoiceChips label="Relation" options={GUEST_RELATION} value={field.value} onChange={field.onChange} />
      )} />
      <Controller control={control} name="eventType" render={({ field }) => (
        <ChoiceChips label="Invited to" options={EVENT_TYPES} value={field.value} onChange={field.onChange} />
      )} />
      <Controller control={control} name="guestCount" render={({ field }) => (
        <Stepper label="Number of guests" value={field.value} min={GUEST_COUNT.min} max={GUEST_COUNT.max} onChange={field.onChange} />
      )} />
      <Controller control={control} name="inviteSent" render={({ field }) => (
        <InviteToggle value={field.value} onChange={field.onChange} />
      )} />
      <Controller control={control} name="status" render={({ field }) => (
        <ChoiceChips check label="Status" options={GUEST_STATUS} value={field.value} onChange={field.onChange} />
      )} />
      <Controller control={control} name="notes" render={({ field, fieldState }) => (
        <AppInput label="Note" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur}
          placeholder="Food preferences, arrival plans…" multiline maxLength={NOTES_MAX} style={styles.notes}
          error={fieldState.error?.message} />
      )} />
      <View style={styles.actions}>
        <AppButton label={submitLabel} icon="checkmark" loading={submitting} disabled={!formState.isDirty}
          onPress={handleSubmit(onSubmit)} />
        {onDelete ? <AppButton label="Delete guest" icon="trash" variant="danger" loading={deleting} onPress={onDelete} /> : null}
      </View>
    </View>
  );
}
