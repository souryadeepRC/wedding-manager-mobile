import { View } from 'react-native';
import { registry } from '@/modules/registry';
import { makeStyles, useTheme } from '@/theme';
import { ModuleTile } from './ModuleTile';

const useStyles = makeStyles(t => ({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.md },
}));

export function ModuleGrid() {
  const styles = useStyles();
  const { tileAccents } = useTheme();
  return (
    <View style={styles.grid}>
      {registry.map((m, i) => <ModuleTile key={m.id} index={i} module={m} accent={tileAccents[i % tileAccents.length]} />)}
    </View>
  );
}
