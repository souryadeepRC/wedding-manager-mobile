import {
  AppButton,
  AppText,
  IconButton,
  SegmentedTabs,
  SideSheet,
} from "@/components";
import { makeStyles } from "@/theme";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { GUEST_RELATION, GUEST_STATUS } from "../guest.constants";
import {
  activeFilterCount,
  emptyFilters,
  type GuestFilters,
  type InviteFilter,
} from "../guest.filters";
import { MultiChips } from "./MultiChips";

type Props = {
  visible: boolean;
  value: GuestFilters;
  // How many guests in the current tab and search a draft would show.
  countMatches: (f: GuestFilters) => number;
  onClose: () => void;
  onApply: (f: GuestFilters) => void;
};

const INVITE_OPTIONS: readonly { value: InviteFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const useStyles = makeStyles((t) => ({
  head: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: t.spacing.lg,
    paddingBottom: 0,
  },
  body: { padding: t.spacing.lg, gap: t.spacing.xl },
  section: { gap: t.spacing.md },
  footer: { flexDirection: "row", gap: t.spacing.md, padding: t.spacing.lg },
  grow: { flex: 1 },
  wide: { flex: 1 },
}));

export function GuestFilterSheet({
  visible,
  value,
  countMatches,
  onClose,
  onApply,
}: Props) {
  const styles = useStyles();
  const [draft, setDraft] = useState(value);
  const [wasVisible, setWasVisible] = useState(visible);

  // Start each opening from the filters currently applied.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setDraft(value);
  }

  const matches = countMatches(draft);
  const active = activeFilterCount(draft);
  return (
    <SideSheet visible={visible} onClose={onClose}>
      <View style={styles.head}>
        <View>
          <AppText variant="h1" accessibilityRole="header">
            Filters
          </AppText>
          <AppText
            variant="body"
            color="textSecondary"
          >{`${active} active · ${matches} ${matches === 1 ? "guest matches" : "guests match"}`}</AppText>
        </View>
        <IconButton
          icon="close"
          variant="filled"
          accessibilityLabel="Close filters"
          onPress={onClose}
        />
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <MultiChips
          label="Connection"
          options={GUEST_RELATION}
          value={draft.connections}
          onChange={(connections) => setDraft((d) => ({ ...d, connections }))}
        />
        <MultiChips
          label="Status"
          options={GUEST_STATUS}
          value={draft.statuses}
          onChange={(statuses) => setDraft((d) => ({ ...d, statuses }))}
        />
        <View style={styles.section}>
          <AppText variant="overline" color="textSecondary">
            Invite sent
          </AppText>
          <SegmentedTabs
            options={INVITE_OPTIONS}
            value={draft.invite}
            onChange={(invite) => setDraft((d) => ({ ...d, invite }))}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.grow}>
          <AppButton
            label="Reset"
            variant="secondary"
            onPress={() => setDraft(emptyFilters)}
          />
        </View>
        <View style={styles.wide}>
          <AppButton
            label={`Apply`}
            onPress={() => {
              onApply(draft);
              onClose();
            }}
          />
        </View>
      </View>
    </SideSheet>
  );
}
