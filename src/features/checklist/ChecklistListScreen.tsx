import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { AppText, Chip, EmptyState, ErrorState, PageHeader, Screen, SegmentedTabs, Skeleton, useToast } from '@/components';
import { useAppStore } from '@/store/appStore';
import { makeStyles, useTheme } from '@/theme';
import { handleError } from '@/utils/errors';
import { TASK_SUGGESTIONS } from './checklist.constants';
import type { ChecklistStatus } from './checklist.schema';
import { ChecklistCard } from './components/ChecklistCard';
import { useChecklistItems } from './hooks/useChecklistItems';
import { useSetChecklistStatus } from './hooks/useChecklistMutations';

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

const useStyles = makeStyles(t => ({
  list: { gap: t.spacing.md, paddingBottom: t.spacing.lg },
  grow: { flexGrow: 1 },
  controls: { gap: t.spacing.md },
  card: { borderRadius: t.radius.xl },
  hint: { paddingHorizontal: t.spacing.xs },
  suggestions: { alignItems: 'center', gap: t.spacing.sm },
}));

export function ChecklistListScreen() {
  const router = useRouter();
  const toast = useToast();
  const styles = useStyles();
  const { colors, tileAccents } = useTheme();
  const weddingId = useAppStore(s => s.currentWeddingId);
  const { data, isLoading, isError, isRefetching, refetch } = useChecklistItems();
  const setStatus = useSetChecklistStatus();
  const [tab, setTab] = useState<ChecklistStatus>('pending');
  const [today] = useState(() => new Date());
  const glow = [tileAccents[3], tileAccents[1]] as const;

  const all = useMemo(() => data ?? [], [data]);
  // Soonest due first; tasks without a date go last.
  const items = useMemo(
    () =>
      all
        .filter(i => i.status === tab)
        .sort((a, b) => (a.dueDate?.getTime() ?? Infinity) - (b.dueDate?.getTime() ?? Infinity)),
    [all, tab],
  );
  const pendingCount = all.filter(i => i.status === 'pending').length;
  const doneCount = all.length - pendingCount;
  const tabs = [
    { value: 'pending' as const, label: 'Pending', count: pendingCount },
    { value: 'done' as const, label: 'Done', count: doneCount },
  ];
  const add = (title?: string) => router.push((title ? `/checklist/new?title=${encodeURIComponent(title)}` : '/checklist/new') as Href);
  const header = (
    <PageHeader title="Checklist" onBack={router.back}
      action={weddingId && !isError ? { label: 'Add task', icon: 'add', onPress: () => add() } : undefined} />
  );

  if (!weddingId) {
    return (
      <Screen edges={[...EDGES]} glow={glow}>
        {header}
        <EmptyState icon="heart" tone={tileAccents[0]} title="Set up your wedding first"
          message="Save your wedding details in Settings, then plan your tasks."
          action={{ label: 'Open Settings', icon: 'settings', onPress: () => router.navigate('/settings') }} />
      </Screen>
    );
  }
  if (isLoading) {
    return (
      <Screen edges={[...EDGES]} glow={glow}>
        {header}
        <Skeleton height={56} style={styles.card} />
        {[0, 1, 2, 3].map(i => <Skeleton key={i} height={88} style={styles.card} />)}
      </Screen>
    );
  }
  if (isError) {
    return (
      <Screen edges={[...EDGES]} glow={[colors.danger, tileAccents[1]]}>
        {header}
        <ErrorState title="Couldn't load tasks" message="Your to-dos haven't gone anywhere. One more try?" onRetry={refetch} />
      </Screen>
    );
  }

  return (
    <Screen edges={[...EDGES]} glow={glow}>
      <View style={styles.controls}>
        {header}
        <SegmentedTabs options={tabs} value={tab} onChange={setTab} />
      </View>
      <FlatList
        data={items}
        keyExtractor={i => i.id}
        contentContainerStyle={items.length ? styles.list : styles.grow}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={tab === 'pending' && items.length > 1
          ? <AppText variant="label" color="textSecondary" style={styles.hint}>Soonest first</AppText> : undefined}
        renderItem={({ item, index }) => (
          <ChecklistCard
            item={item}
            today={today}
            index={index}
            onPress={() => router.push(`/checklist/${item.id}/edit` as Href)}
            onToggle={() =>
              setStatus.mutate(
                { id: item.id, status: item.status === 'done' ? 'pending' : 'done' },
                { onError: e => handleError(e, toast) },
              )
            }
          />
        )}
        ListEmptyComponent={
          tab === 'done' ? (
            <EmptyState icon="checkbox" tone={colors.accent} title="Nothing done yet" message="Tick tasks off as you finish them." />
          ) : doneCount ? (
            <EmptyState celebrate icon="checkmark" tone={colors.success} title="All done! 🎉"
              message="Every task is ticked off. Go put your feet up."
              action={{ label: `See the ${doneCount} done ${doneCount === 1 ? 'task' : 'tasks'}`, variant: 'secondary', onPress: () => setTab('done') }} />
          ) : (
            <EmptyState icon="checkbox" tone={colors.accent} title="No tasks yet"
              message="Jot the little things before they become big things. Tap one to start:">
              <View style={styles.suggestions}>
                {TASK_SUGGESTIONS.map(s => <Chip key={s} label={s} icon="add" onPress={() => add(s)} />)}
              </View>
            </EmptyState>
          )
        }
      />
    </Screen>
  );
}
