import { View } from 'react-native';
import { Skeleton } from '@/components';
import { makeStyles } from '@/theme';

const useStyles = makeStyles(t => ({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.md },
  tile: { flexBasis: '47%', flexGrow: 1, borderRadius: t.radius.xl },
  card: { borderRadius: t.radius.xl },
}));

// Same shapes as the loaded Home: hero, spend card, then the 2x2 tiles.
export function HomeSkeleton() {
  const styles = useStyles();
  return (
    <>
      <Skeleton height={220} style={styles.card} />
      <Skeleton height={88} style={styles.card} />
      <View style={styles.grid}>
        {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} height={156} style={styles.tile} />)}
      </View>
    </>
  );
}
