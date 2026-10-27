import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppText, ChoiceChips, DateField } from '@/components';
import { makeStyles } from '@/theme';
import { formatINR } from '@/utils/currency';
import { PAYMENT_MODES } from '../expense.constants';
import { makePaymentSchema, type PaymentForm as PaymentFormValues } from '../expense.schema';
import { AmountInput } from './AmountInput';

type Props = {
  initialValues: PaymentFormValues;
  // Most this payment may be: what is still owed (plus its own amount when editing).
  maxAmount: number;
  editing?: boolean;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: PaymentFormValues) => void;
  onDelete?: () => void;
  deleting?: boolean;
};

const useStyles = makeStyles(t => ({
  form: { flexGrow: 1, gap: t.spacing.xl },
  actions: { marginTop: 'auto', gap: t.spacing.sm },
}));

export function PaymentForm({ initialValues, maxAmount, editing, submitLabel, submitting, onSubmit, onDelete, deleting }: Props) {
  const styles = useStyles();
  const schema = useMemo(() => makePaymentSchema(maxAmount), [maxAmount]);
  const { control, handleSubmit, formState } = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: initialValues,
  });
  const hint = (
    <AppText variant="caption" color="textSecondary">
      {'Left to pay '}<AppText variant="label" color="textPrimary">{formatINR(maxAmount)}</AppText>
      {editing ? ' including this payment' : ''}
    </AppText>
  );
  return (
    <View style={styles.form}>
      <Controller control={control} name="amount" render={({ field, fieldState }) => (
        <AmountInput label="Amount" value={field.value} onChange={field.onChange} error={fieldState.error?.message} hint={hint} />
      )} />
      <Controller control={control} name="paidOn" render={({ field, fieldState }) => (
        <DateField label="Paid on" value={field.value} onChange={d => field.onChange(d ?? field.value)}
          error={fieldState.error?.message} />
      )} />
      <Controller control={control} name="mode" render={({ field }) => (
        <ChoiceChips label="Paid with" options={PAYMENT_MODES} value={field.value} onChange={field.onChange} />
      )} />
      <View style={styles.actions}>
        <AppButton label={submitLabel} icon="checkmark" loading={submitting} disabled={!formState.isDirty || !formState.isValid}
          onPress={handleSubmit(onSubmit)} />
        {onDelete ? <AppButton label="Delete payment" icon="trash" variant="danger" loading={deleting} onPress={onDelete} /> : null}
      </View>
    </View>
  );
}
