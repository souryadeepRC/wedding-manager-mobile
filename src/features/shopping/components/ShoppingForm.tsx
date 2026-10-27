import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput, ChoiceChips } from '@/components';
import { makeStyles } from '@/theme';
import { ITEM_FOR, SHOPPING_STATUS, TITLE_MAX } from '../shopping.constants';
import { shoppingFormSchema, type ShoppingForm as ShoppingFormValues } from '../shopping.schema';

type Props = {
  initialValues: ShoppingFormValues;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: ShoppingFormValues) => void;
  onDelete?: () => void;
  deleting?: boolean;
};

const useStyles = makeStyles(t => ({
  form: { flexGrow: 1, gap: t.spacing.xl },
  actions: { marginTop: 'auto', gap: t.spacing.sm },
}));

export function ShoppingForm({ initialValues, submitLabel, submitting, onSubmit, onDelete, deleting }: Props) {
  const styles = useStyles();
  const { control, handleSubmit, formState } = useForm<ShoppingFormValues>({
    resolver: zodResolver(shoppingFormSchema),
    mode: 'onChange',
    defaultValues: initialValues,
  });
  return (
    <View style={styles.form}>
      <Controller control={control} name="title" render={({ field, fieldState }) => (
        <AppInput label="What to buy" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur}
          placeholder="e.g. Haldi kurta (yellow)" maxLength={TITLE_MAX} autoCapitalize="sentences" error={fieldState.error?.message} />
      )} />
      <Controller control={control} name="itemFor" render={({ field }) => (
        <ChoiceChips grid label="Item for" options={ITEM_FOR} value={field.value} onChange={field.onChange} />
      )} />
      <Controller control={control} name="status" render={({ field }) => (
        <ChoiceChips label="Status" options={SHOPPING_STATUS} value={field.value} onChange={field.onChange} />
      )} />
      <View style={styles.actions}>
        <AppButton label={submitLabel} icon="checkmark" loading={submitting} disabled={!formState.isDirty || !formState.isValid}
          onPress={handleSubmit(onSubmit)} />
        {onDelete ? <AppButton label="Delete item" icon="trash" variant="danger" loading={deleting} onPress={onDelete} /> : null}
      </View>
    </View>
  );
}
