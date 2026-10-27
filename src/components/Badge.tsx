import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';
import { AppText } from './AppText';

type Props = {
  label: string;
  // Any theme colour: the pill is tinted with it and the text drawn in it. Neutral when omitted.
  tone?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md';
};

const useStyles = makeStyles(t => ({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.xs,
    borderRadius: t.radius.pill,
  },
  sm: { paddingHorizontal: t.spacing.sm, paddingVertical: t.spacing.xxs },
  md: { paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.xs },
}));

export function Badge({ label, tone, icon, size = 'sm' }: Props) {
  const { colors, alpha, sizes } = useTheme();
  const styles = useStyles();
  const fg = tone ?? colors.textSecondary;
  return (
    <View style={[styles.badge, styles[size], { backgroundColor: tone ? tone + alpha.tint : colors.surfaceAlt }]}>
      {icon ? <Ionicons name={icon} size={sizes.icon.sm - 2} color={fg} /> : null}
      <AppText variant="label" style={{ color: fg }}>{label}</AppText>
    </View>
  );
}
