import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { EmptyState, ErrorState, PageHeader, Screen, SegmentedTabs, Skeleton, useToast } from '@/components';
import { useAppStore } from '@/store/appStore';
import { makeStyles, useTheme } from '@/theme';
import { handleError } from '@/utils/errors';
import { ShoppingCard } from './components/ShoppingCard';
import { useShoppingItems } from './hooks/useShoppingItems';
import { useSetShoppingStatus } from './hooks/useShoppingMutations';
import type { ShoppingStatus } from './shopping.schema';

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

const useStyles = makeStyles(t => ({
  list: { gap: t.spacing.md, paddingBottom: t.spacing.lg },
  grow: { flexGrow: 1 },
  controls: { gap: t.spacing.md },
  card: { borderRadius: t.radius.xl },
}));

export function ShoppingListScreen() {
  const router = useRouter();
  const toast = useToast();
  const styles = useStyles();
  const { colors, tileAccents } = useTheme();
  const weddingId = useAppStore(s => s.currentWeddingId);
  const { data, isLoading, isError, isRefetching, refetch } = useShoppingItems();
  const setStatus = useSetShoppingStatus();
  const [tab, setTab] = useState<ShoppingStatus>('pending');
  const glow = [tileAccents[2], tileAccents[0]] as const;

  const all = useMemo(() => data ?? [], [data]);
  const items = useMemo(() => all.filter(i => i.status === tab), [all, tab]);
  const pendingCount = all.filter(i => i.status === 'pending').length;
  const doneCount = all.length - pendingCount;
  const tabs = [
    { value: 'pending' as const, label: 'Pending', count: pendingCount },
    { value: 'done' as const, label: 'Done', count: doneCount },
  ];
  const header = (
    <PageHeader title="Shopping" onBack={router.back}
      action={weddingId && !isError ? { label: 'Add item', icon: 'add', onPress: () => router.push('/shopping/new' as Href) } : undefined} />
  );

  if (!weddingId) {
    return (
      <Screen edges={[...EDGES]} glow={glow}>
        {header}
        <EmptyState icon="heart" tone={tileAccents[0]} title="Set up your wedding first"
          message="Save your wedding details in Settings, then plan your shopping."
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
        <ErrorState title="Couldn't load your list" message="The sarees are still on the list. Let's try once more." onRetry={refetch} />
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
        renderItem={({ item, index }) => (
          <ShoppingCard
            item={item}
            index={index}
            onPress={() => router.push(`/shopping/${item.id}/edit` as Href)}
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
            <EmptyState icon="bag-check" tone={tileAccents[2]} title="Nothing bought yet"
              message="Tick items off as you buy them and they'll land here." />
          ) : doneCount ? (
            <EmptyState celebrate icon="checkmark" tone={colors.success} title="All done! 🎉"
              message="Every last bangle is bought. You've earned a cutting chai."
              action={{ label: `See the ${doneCount} done ${doneCount === 1 ? 'item' : 'items'}`, variant: 'secondary', onPress: () => setTab('done') }} />
          ) : (
            <EmptyState icon="bag-handle" tone={tileAccents[2]} title="Nothing to buy yet"
              message="Sarees, sherwanis, mehendi cones… add the first thing on your list."
              action={{ label: 'Add your first item', icon: 'add', onPress: () => router.push('/shopping/new' as Href) }} />
          )
        }
      />
    </Screen>
  );
}
