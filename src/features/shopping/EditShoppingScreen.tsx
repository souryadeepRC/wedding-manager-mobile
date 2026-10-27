import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { ErrorState, PageHeader, Screen, Skeleton, useToast } from '@/components';
import { confirm } from '@/utils/confirm';
import { handleError } from '@/utils/errors';
import { ShoppingForm } from './components/ShoppingForm';
import { useShoppingItems } from './hooks/useShoppingItems';
import { useDeleteShopping, useUpdateShopping } from './hooks/useShoppingMutations';
import { toShoppingFormValues } from './shopping.schema';

// Pushed over the tabs, so this screen owns the bottom inset too.
const EDGES: ('top' | 'left' | 'right' | 'bottom')[] = ['top', 'left', 'right', 'bottom'];

export function EditShoppingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useShoppingItems();
  const update = useUpdateShopping(id);
  const remove = useDeleteShopping(id);
  const item = data?.find(i => i.id === id);

  const header = <PageHeader title="Edit item" onBack={router.back} />;
  if (isLoading) return <Screen edges={EDGES}>{header}<Skeleton height={64} /><Skeleton height={64} /></Screen>;
  if (isError || !item) {
    return <Screen edges={EDGES}>{header}<ErrorState title="Couldn't load this item" message="It's still on the list. Let's try once more." onRetry={refetch} /></Screen>;
  }

  const onDelete = async () => {
    if (!(await confirm('Delete item?', `${item.title} will be removed permanently.`, 'Delete', 'Cancel'))) return;
    remove.mutate(undefined, {
      onSuccess: () => {
        toast('Item deleted');
        router.dismissTo('/shopping' as Href);
      },
      onError: e => handleError(e, toast),
    });
  };

  return (
    <Screen scroll keyboardAvoiding edges={EDGES}>
      {header}
      <ShoppingForm
        initialValues={toShoppingFormValues(item)}
        submitLabel="Save changes"
        submitting={update.isPending}
        onSubmit={values =>
          update.mutate(values, {
            onSuccess: () => {
              toast('Item updated');
              router.dismissTo('/shopping' as Href);
            },
            onError: e => handleError(e, toast),
          })
        }
        onDelete={onDelete}
        deleting={remove.isPending}
      />
    </Screen>
  );
}
