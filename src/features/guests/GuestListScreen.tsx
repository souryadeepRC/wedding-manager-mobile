import {
  EmptyState,
  ErrorState,
  PageHeader,
  Screen,
  SegmentedTabs,
  Skeleton,
} from "@/components";
import { useAppStore } from "@/store/appStore";
import { makeStyles, useTheme } from "@/theme";
import { useRouter, type Href } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { GuestCard } from "./components/GuestCard";
import { GuestFilterSheet } from "./components/GuestFilterSheet";
import { GuestSearchBar } from "./components/GuestSearchBar";
import { EVENT_TYPES } from "./guest.constants";
import {
  activeFilterCount,
  describeNoMatch,
  emptyFilters,
  filterGuests,
  type GuestFilters,
} from "./guest.filters";
import type { GuestForm } from "./guest.schema";
import { useGuests } from "./hooks/useGuests";

const useStyles = makeStyles((t) => ({
  list: { gap: t.spacing.md, paddingBottom: t.spacing.lg },
  grow: { flexGrow: 1 },
  controls: { gap: t.spacing.md },
  card: { borderRadius: t.radius.xl },
}));

export function GuestListScreen() {
  const router = useRouter();
  const styles = useStyles();
  const { tileAccents } = useTheme();
  const weddingId = useAppStore((s) => s.currentWeddingId);
  const { data, isLoading, isError, isRefetching, refetch } = useGuests();
  const [tab, setTab] = useState<GuestForm["eventType"]>("wedding");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<GuestFilters>(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const all = useMemo(() => data ?? [], [data]);
  const inTab = useMemo(
    () => all.filter((g) => g.eventType === tab),
    [all, tab],
  );
  const guests = useMemo(
    () => filterGuests(inTab, search, filters),
    [inTab, search, filters],
  );
  // Each tab shows how many people are invited to that event (sum of guest counts), ignoring search and filters.
  const tabs = EVENT_TYPES.map((e) => ({
    value: e.value,
    label: e.label,
    count: all
      .filter((g) => g.eventType === e.value)
      .reduce((sum, g) => sum + g.guestCount, 0),
  }));
  const people = all.reduce((sum, g) => sum + g.guestCount, 0);
  const narrowed = activeFilterCount(filters) > 0 || search.trim().length > 0;
  const glow = [tileAccents[0], tileAccents[1]] as const;

  const add = () => router.push(`/guests/new?type=${tab}` as Href);
  const header = (
    <PageHeader
      title="Guest"
      subtitle={
        all.length
          ? `${all.length} invites · ${people} people`
          : isLoading || isError
            ? undefined
            : "Your list starts here"
      }
      action={
        weddingId && !isError
          ? { label: "Add guest", icon: "add", onPress: add }
          : undefined
      }
    />
  );

  // Guests belong to a wedding row, which is created on the first Settings save.
  if (!weddingId) {
    return (
      <Screen glow={glow}>
        {header}
        <EmptyState
          icon="heart"
          tone={tileAccents[0]}
          title="Set up your wedding first"
          message="Save your wedding details in Settings, then add your guests."
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
        <Skeleton height={56} style={styles.card} />
        <Skeleton height={56} style={styles.card} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={84} style={styles.card} />
        ))}
      </Screen>
    );
  }
  if (isError) {
    return (
      <Screen glow={glow}>
        {header}
        <ErrorState
          title="Couldn't load guests"
          message="Nothing's lost. Give it another try in a moment."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const clear = () => {
    setSearch("");
    setFilters(emptyFilters);
  };
  return (
    <Screen glow={glow}>
      <View style={styles.controls}>
        {header}
        <SegmentedTabs options={tabs} value={tab} onChange={setTab} />
        {all.length ? (
          <GuestSearchBar
            value={search}
            onChange={setSearch}
            activeFilters={activeFilterCount(filters)}
            onOpenFilters={() => setFiltersOpen(true)}
          />
        ) : null}
      </View>
      <FlatList
        data={guests}
        keyExtractor={(g) => g.id}
        contentContainerStyle={guests.length ? styles.list : styles.grow}
        keyboardShouldPersistTaps="handled"
        refreshing={isRefetching}
        onRefresh={refetch}
        renderItem={({ item, index }) => (
          <GuestCard
            guest={item}
            index={index}
            onPress={() => router.push(`/guests/${item.id}/edit` as Href)}
          />
        )}
        ListEmptyComponent={
          narrowed ? (
            <EmptyState
              icon="search"
              tone={tileAccents[2]}
              title="No matches"
              message={describeNoMatch(search, filters)}
              action={{
                label: "Clear filters",
                icon: "close",
                variant: "secondary",
                onPress: clear,
              }}
            />
          ) : all.length ? (
            <EmptyState
              icon="people"
              tone={tileAccents[0]}
              title={`No ${tab} guests yet`}
              message={`Nobody is on the ${tab} list so far.`}
              action={{ label: "Add guest", icon: "add", onPress: add }}
            />
          ) : (
            <EmptyState
              icon="people"
              tone={tileAccents[0]}
              title="No guests yet"
              message="Start with the family — they'll be the first to ask if they're invited."
              action={{
                label: "Add your first guest",
                icon: "add",
                onPress: add,
              }}
            />
          )
        }
      />
      <GuestFilterSheet
        visible={filtersOpen}
        value={filters}
        countMatches={(f) => filterGuests(inTab, search, f).length}
        onClose={() => setFiltersOpen(false)}
        onApply={setFilters}
      />
    </Screen>
  );
}
