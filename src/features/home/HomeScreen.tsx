import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorState, Screen } from '@/components';
import { useExpenseData } from '@/features/expenses';
import { useWedding } from '@/features/wedding';
import { CountdownCard } from './components/CountdownCard';
import { ExpenseCard } from './components/ExpenseCard';
import { HomeHeader } from './components/HomeHeader';
import { HomeSkeleton } from './components/HomeSkeleton';
import { ModuleGrid } from './components/ModuleGrid';

export function HomeScreen() {
  const qc = useQueryClient();
  const wedding = useWedding();
  const expenses = useExpenseData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(['wedding', 'expenses', 'guests', 'shopping', 'checklist'].map(k => qc.refetchQueries({ queryKey: [k] })));
    } finally {
      setRefreshing(false);
    }
  }, [qc]);

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <HomeHeader />
      {wedding.isPending ? (
        <HomeSkeleton />
      ) : wedding.isError ? (
        <ErrorState
          title="Couldn't load your plans"
          message="Something hiccuped on our side. Your guests and payments are safe on this phone."
          onRetry={wedding.refetch}
        />
      ) : (
        <>
          <CountdownCard wedding={wedding.data} />
          <ExpenseCard
            paid={expenses.totals.paid}
            total={expenses.totals.total}
            loading={expenses.isLoading}
            error={expenses.isError}
            onRetry={expenses.refetch}
          />
          <ModuleGrid />
        </>
      )}
    </Screen>
  );
}
