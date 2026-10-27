import { Controller, useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput, AppText, Chip } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { TITLE_MAX } from '../expense.constants';
import { expenseFormSchema, type ExpenseForm as ExpenseFormValues } from '../expense.schema';
import { EXPENSE_KINDS, expenseVisual } from '../expense.visuals';
import { AmountInput } from './AmountInput';

type Props = {
  initialValues: ExpenseFormValues;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: ExpenseFormValues) => void;
  onDelete?: () => void;
  deleting?: boolean;
};

const useStyles = makeStyles(t => ({
  form: { flexGrow: 1, gap: t.spacing.xl },
  icon: { width: t.sizes.touch, height: t.sizes.touch, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center', marginLeft: -t.spacing.sm },
  picks: { gap: t.spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  actions: { marginTop: 'auto', gap: t.spacing.sm },
}));

export function ExpenseForm({ initialValues, submitLabel, submitting, onSubmit, onDelete, deleting }: Props) {
  const styles = useStyles();
  const { tileAccents, alpha, sizes } = useTheme();
  const { control, handleSubmit, formState, setValue } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    mode: 'onChange',
    defaultValues: initialValues,
  });
  // The icon beside the title follows what is typed ("caterer" -> fork and knife).
  const title = useWatch({ control, name: 'title' });
  const visual = expenseVisual(title);
  const tone = tileAccents[visual.tone % tileAccents.length];
  const pick = (label: string) => setValue('title', label, { shouldDirty: true, shouldValidate: true });

  return (
    <View style={styles.form}>
      <Controller control={control} name="title" render={({ field, fieldState }) => (
        <AppInput label="What's it for?" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur}
          placeholder="e.g. Decor & mandap" maxLength={TITLE_MAX} autoCapitalize="sentences" error={fieldState.error?.message}
          hint="Say “caterer”, “photo”, “mehendi”… and we'll match an icon."
          left={(
            <View style={[styles.icon, { backgroundColor: tone + alpha.tint }]}>
              <Ionicons name={visual.icon} size={sizes.icon.sm} color={tone} />
            </View>
          )} />
      )} />
      <Controller control={control} name="totalAmount" render={({ field, fieldState }) => (
        <AmountInput label="Total amount" value={field.value} onChange={field.onChange}
          error={fieldState.error?.message} />
      )} />
      <View style={styles.picks}>
        <AppText variant="label" color="textSecondary">Quick picks</AppText>
        <View style={styles.row}>
          {EXPENSE_KINDS.map(k => (
            <Chip key={k.label} label={k.label} icon={k.icon} tone={tileAccents[k.tone % tileAccents.length]}
              selected={title.trim().toLowerCase() === k.label.toLowerCase()} onPress={() => pick(k.label)} />
          ))}
        </View>
      </View>
      <View style={styles.actions}>
        <AppButton label={submitLabel} icon="checkmark" loading={submitting} disabled={!formState.isDirty || !formState.isValid}
          onPress={handleSubmit(onSubmit)} />
        {onDelete ? (
          <AppButton label="Delete expense" icon="trash" variant="danger" loading={deleting} onPress={onDelete} />
        ) : null}
      </View>
    </View>
  );
}
