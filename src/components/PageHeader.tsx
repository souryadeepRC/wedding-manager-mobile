import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';
import { makeStyles } from '@/theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { IconButton } from './IconButton';

type Action = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

type Props = {
  title?: string;
  // Small text under the title (counts, "Unsaved changes", the parent expense...).
  subtitle?: ReactNode;
  onBack?: () => void;
  // Breadcrumb shown beside the back button instead of a big title (detail screens).
  crumb?: string;
  action?: Action;
};

const useStyles = makeStyles(t => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md, minHeight: t.sizes.avatar.md },
  titles: { flex: 1, gap: t.spacing.xxs },
}));

// In-screen header that replaces the native stack header: serif title, optional back button and a pill action.
export function PageHeader({ title, subtitle, onBack, crumb, action }: Props) {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      {onBack ? <IconButton icon="chevron-back" variant="filled" accessibilityLabel="Go back" onPress={onBack} /> : null}
      <View style={styles.titles}>
        {crumb ? <AppText variant="title" color="textSecondary">{crumb}</AppText> : null}
        {title ? <AppText variant="h1" accessibilityRole="header" numberOfLines={2}>{title}</AppText> : null}
        {typeof subtitle === 'string' ? <AppText variant="caption" color="textSecondary">{subtitle}</AppText> : subtitle}
      </View>
      {action ? (
        <AppButton compact label={action.label} icon={action.icon} onPress={action.onPress}
          disabled={action.disabled} loading={action.loading} />
      ) : null}
    </View>
  );
}
