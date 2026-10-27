import { View, type ViewProps } from 'react-native';
import { makeStyles } from '@/theme';

const useStyles = makeStyles(t => ({
  card: {
    backgroundColor: t.colors.surface,
    borderColor: t.colors.border,
    borderWidth: t.sizes.border,
    borderRadius: t.radius.xl,
    padding: t.spacing.lg,
    gap: t.spacing.md,
  },
}));

export function Card({ style, ...rest }: ViewProps) {
  const styles = useStyles();
  return <View style={[styles.card, style]} {...rest} />;
}
