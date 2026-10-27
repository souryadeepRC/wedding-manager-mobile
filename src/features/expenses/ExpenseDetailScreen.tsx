import { View } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { AppButton, AppText, Badge, EmptyState, ErrorState, PageHeader, Screen, Skeleton } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { BalanceCard } from './components/BalanceCard';
import { PaymentRow } from './components/PaymentRow';
import { expenseVisual } from './expense.visuals';
import { useExpenseData } from './hooks/useExpenseData';

const useStyles = makeStyles(t => ({
  actions: { flexDirection: 'row', gap: t.spacing.md },
  grow: { flex: 1 },
  list: { gap: t.spacing.md },
  heading: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  card: { borderRadius: t.radius.xl },
}));

export function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const styles = useStyles();
  const { colors, tileAccents } = useTheme();
  const { expenses, paymentsByExpense, isLoading, isError, isRefetching, refetch } = useExpenseData();
  const expense = expenses.find(e => e.id === id);
  const payments = paymentsByExpense.get(id) ?? [];
  const header = <PageHeader crumb="Expenses" onBack={router.back} />;

  if (isLoading) {
    return <Screen>{header}<Skeleton height={260} style={styles.card} /><Skeleton height={84} style={styles.card} /></Screen>;
  }
  if (isError || !expense) {
    return (
      <Screen>
        {header}
        <ErrorState title="Couldn't load this expense" message="Your payments are safe. Let's try again." onRetry={refetch} />
      </Screen>
    );
  }

  const paidInFull = expense.remaining === 0;
  const tone = paidInFull ? colors.success : tileAccents[expenseVisual(expense.title).tone % tileAccents.length];
  return (
    <Screen scroll glow={[tone, tileAccents[1]]} refreshing={isRefetching} onRefresh={refetch}>
      {header}
      <BalanceCard title={expense.title} total={expense.totalAmount} paid={expense.paid} remaining={expense.remaining} />
      <View style={styles.actions}>
        <View style={styles.grow}>
          <AppButton label="Add payment" icon="add" disabled={paidInFull}
            accessibilityLabel={paidInFull ? 'Add payment, already paid in full' : undefined}
            onPress={() => router.push(`/expenses/${id}/payment/new` as Href)} />
        </View>
        <View style={styles.grow}>
          <AppButton label="Edit expense" variant="secondary" icon="pencil"
            onPress={() => router.push(`/expenses/${id}/edit` as Href)} />
        </View>
      </View>
      <View style={styles.heading}>
        <AppText variant="title" accessibilityRole="header">Payments</AppText>
        <Badge label={`${payments.length}`} tone={tileAccents[6 % tileAccents.length]} />
      </View>
      {payments.length ? (
        <View style={styles.list}>
          {payments.map((p, i) => (
            <PaymentRow key={p.id} payment={p} index={i} onPress={() => router.push(`/expenses/${id}/payment/${p.id}` as Href)} />
          ))}
        </View>
      ) : (
        <EmptyState framed icon="cash" tone={colors.accent} title="No payments yet"
          message="Paid an advance? Log it here and we'll keep the math." />
      )}
    </Screen>
  );
}
