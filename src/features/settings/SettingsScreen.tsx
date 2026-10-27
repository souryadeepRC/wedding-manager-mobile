import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AppInput, AppText, Card, DateField, ErrorState, PageHeader, Screen, Skeleton, useToast,
} from '@/components';
import { useAppStore } from '@/store/appStore';
import { makeStyles, useTheme } from '@/theme';
import { getCountdown } from '@/utils/date';
import { handleError } from '@/utils/errors';
import {
  toFormValues, useUpdateWedding, useWedding, weddingFormSchema, type WeddingForm,
} from '@/features/wedding';
import { LeaveDialog } from './components/LeaveDialog';
import { ThemePicker } from './components/ThemePicker';
import { settingsGuard } from './unsavedGuard';

const useStyles = makeStyles(t => ({
  section: { gap: t.spacing.sm },
  heading: { paddingHorizontal: t.spacing.xs },
  unsaved: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.xs },
  dot: { width: t.sizes.dot + t.spacing.xxs, height: t.sizes.dot + t.spacing.xxs, borderRadius: t.radius.pill, backgroundColor: t.colors.accent },
  card: { borderRadius: t.radius.xl },
}));

export function SettingsScreen() {
  const toast = useToast();
  const styles = useStyles();
  const { colors, tileAccents } = useTheme();
  const themeName = useAppStore(s => s.themeName);
  const setThemeName = useAppStore(s => s.setThemeName);
  const { data: wedding, isPending, isError, refetch } = useWedding();
  const update = useUpdateWedding();
  const [leave, setLeave] = useState<(() => void) | null>(null);

  const form = useForm<WeddingForm>({
    resolver: zodResolver(weddingFormSchema),
    mode: 'onChange',
    defaultValues: {
      brideName: '', groomName: '', weddingDate: null, receptionDate: null,
    },
  });
  const { control, handleSubmit, reset, formState } = form;
  const dirty = formState.isDirty;
  const dateChanged = !!formState.dirtyFields.weddingDate;

  useEffect(() => {
    if (wedding && !formState.isDirty) reset(toFormValues(wedding));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wedding]);

  // Switching tabs with unsaved edits opens the leave dialog instead.
  useEffect(
    () => settingsGuard.register({ isDirty: () => dirty, onBlocked: go => setLeave(() => go) }),
    [dirty],
  );

  const save = (after?: () => void) =>
    handleSubmit(values =>
      update.mutate(values, {
        onSuccess: row => {
          reset(toFormValues(row));
          const countdown = getCountdown(row.weddingDate);
          toast('Saved!', {
            detail: dateChanged && countdown.kind !== 'none'
              ? `Countdown updated · ${countdown.label} 🎉`
              : 'Your wedding details are up to date',
          });
          after?.();
        },
        onError: e => handleError(e, toast),
      }),
    )();

  const header = (
    <PageHeader
      title="Settings"
      subtitle={dirty ? (
        <View style={styles.unsaved}>
          <View style={styles.dot} />
          <AppText variant="caption" color="textSecondary">Unsaved changes</AppText>
        </View>
      ) : undefined}
      action={isPending || isError ? undefined : { label: 'Save', icon: 'checkmark', disabled: !dirty, loading: update.isPending, onPress: () => save() }}
    />
  );

  if (isPending) {
    return (
      <Screen>
        {header}
        <Skeleton height={200} style={styles.card} />
        <Skeleton height={200} style={styles.card} />
        <Skeleton height={120} style={styles.card} />
      </Screen>
    );
  }
  if (isError) {
    return (
      <Screen>
        {header}
        <ErrorState title="Couldn't load your settings" message="Your details are safe. Let's try again." onRetry={refetch} />
      </Screen>
    );
  }

  const go = (fn: () => void) => { setLeave(null); fn(); };
  return (
    <Screen scroll keyboardAvoiding glow={[tileAccents[1], tileAccents[0]]}>
      {header}
      <View style={styles.section}>
        <AppText variant="overline" color="textSecondary" style={styles.heading}>The couple</AppText>
        <Card>
          <Controller control={control} name="brideName" render={({ field, fieldState }) => (
            <AppInput label="Bride's name" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur}
              error={fieldState.error?.message} autoCapitalize="words" placeholder="e.g. Ananya" />
          )} />
          <Controller control={control} name="groomName" render={({ field, fieldState }) => (
            <AppInput label="Groom's name" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur}
              error={fieldState.error?.message} autoCapitalize="words" placeholder="e.g. Rohan" />
          )} />
        </Card>
      </View>
      <View style={styles.section}>
        <AppText variant="overline" color="textSecondary" style={styles.heading}>Big days</AppText>
        <Card>
          <Controller control={control} name="weddingDate" render={({ field, fieldState }) => (
            <DateField clearable label="Wedding date" icon="heart" iconColor={colors.primary} value={field.value}
              onChange={d => field.onChange(d)} error={fieldState.error?.message} />
          )} />
          <Controller control={control} name="receptionDate" render={({ field, fieldState }) => (
            <DateField clearable label="Reception date" icon="calendar" iconColor={tileAccents[6 % tileAccents.length]}
              value={field.value} onChange={d => field.onChange(d)} error={fieldState.error?.message} />
          )} />
        </Card>
      </View>
      <View style={styles.section}>
        <AppText variant="overline" color="textSecondary" style={styles.heading}>Theme</AppText>
        <ThemePicker value={themeName} onChange={setThemeName} />
      </View>
      <LeaveDialog
        visible={!!leave}
        dateChanged={dateChanged}
        saving={update.isPending}
        onSave={() => leave && save(() => go(leave))}
        onDiscard={() => { if (wedding) reset(toFormValues(wedding)); if (leave) go(leave); }}
        onKeepEditing={() => setLeave(null)}
      />
    </Screen>
  );
}
