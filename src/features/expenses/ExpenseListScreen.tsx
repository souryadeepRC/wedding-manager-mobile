import {
  Chip,
  EmptyState,
  ErrorState,
  PageHeader,
  Screen,
  Skeleton,
} from "@/components";
import { useAppStore } from "@/store/appStore";
import { makeStyles, useTheme } from "@/theme";
import { useRouter, type Href } from "expo-router";
import { FlatList, View } from "react-native";
import { BalanceCard } from "./components/BalanceCard";
import { ExpenseListCard } from "./components/ExpenseListCard";
import { EXPENSE_KINDS } from "./expense.visuals";
import { useExpenseData } from "./hooks/useExpenseData";

// Suggested first expenses on the empty screen.
const BIG_THREE = ["Venue", "Caterer", "Decor"];

const useStyles = makeStyles((t) => ({
  list: { gap: t.spacing.md, paddingBottom: t.spacing.lg },
  grow: { flexGrow: 1 },
  card: { borderRadius: t.radius.xl },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: t.spacing.sm,
  },
}));

export function ExpenseListScreen() {
  const router = useRouter();
  const styles = useStyles();
  const { tileAccents } = useTheme();
  const weddingId = useAppStore((s) => s.currentWeddingId);
  const {
    expenses,
    paymentsByExpense,
    totals,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useExpenseData();
  const glow = [tileAccents[1], tileAccents[0]] as const;

  const add = (title?: string) =>
    router.push(
      (title
        ? `/expenses/new?title=${encodeURIComponent(title)}`
        : "/expenses/new") as Href,
    );
  const payments = [...paymentsByExpense.values()].reduce(
    (n, list) => n + list.length,
    0,
  );
  const subtitle = expenses.length
    ? `${expenses.length} ${expenses.length === 1 ? "expense" : "expenses"} · ${payments} ${payments === 1 ? "payment" : "payments"}`
    : isLoading || isError
      ? undefined
      : "Nothing tracked yet";
  const header = (
    <PageHeader
      title="Expense"
      subtitle={subtitle}
      action={
        weddingId && !isError
          ? { label: "Add expense", icon: "add", onPress: () => add() }
          : undefined
      }
    />
  );

  if (!weddingId) {
    return (
      <Screen glow={glow}>
        {header}
        <EmptyState
          icon="heart"
          tone={tileAccents[0]}
          title="Set up your wedding first"
          message="Save your wedding details in Settings, then add your expenses."
          action={{
            label: "Open Settings",
            icon: "settings",
            onPress: () => router.navigate("/settings"),
          }}
        />
      </Screen>
    );
  }
  if (isLoading) {
    return (
      <Screen glow={glow}>
        {header}
        <Skeleton height={200} style={styles.card} />
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={120} style={styles.card} />
        ))}
      </Screen>
    );
  }
  if (isError) {
    return (
      <Screen glow={glow}>
        {header}
        <ErrorState
          title="Couldn't load expenses"
          message="Your payments are safe. Let's try fetching them again."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  return (
    <Screen glow={glow}>
      {header}
      <FlatList
        data={expenses}
        keyExtractor={(e) => e.id}
        contentContainerStyle={expenses.length ? styles.list : styles.grow}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={
          expenses.length ? <BalanceCard {...totals} /> : undefined
        }
        renderItem={({ item, index }) => (
          <ExpenseListCard
            expense={item}
            index={index}
            onPress={() => router.push(`/expenses/${item.id}` as Href)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="wallet"
            tone={tileAccents[1]}
            title="No expenses yet"
            message="Start with the big three. We'll add up what's paid and what's left."
            action={{
              label: "Add your first expense",
              icon: "add",
              onPress: () => add(),
            }}
          >
            <View style={styles.chips}>
              {EXPENSE_KINDS.filter((k) => BIG_THREE.includes(k.label)).map(
                (k) => (
                  <Chip
                    key={k.label}
                    label={k.label}
                    icon={k.icon}
                    tone={tileAccents[k.tone % tileAccents.length]}
                    onPress={() => add(k.label)}
                  />
                ),
              )}
            </View>
          </EmptyState>
        }
      />
    </Screen>
  );
}
