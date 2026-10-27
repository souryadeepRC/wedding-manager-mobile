import { useRouter, type Href } from 'expo-router';
import { PageHeader, Screen, useToast } from '@/components';
import { useTheme } from '@/theme';
import { handleError } from '@/utils/errors';
import { ShoppingForm } from './components/ShoppingForm';
import { useCreateShopping } from './hooks/useShoppingMutations';
import { defaultShoppingForm } from './shopping.schema';

export function AddShoppingScreen() {
  const router = useRouter();
  const toast = useToast();
  const { tileAccents } = useTheme();
  const create = useCreateShopping();
  return (
    <Screen scroll keyboardAvoiding edges={['top', 'left', 'right', 'bottom']} glow={[tileAccents[2], tileAccents[0]]}>
      <PageHeader title="Add item" onBack={router.back} />
      <ShoppingForm
        initialValues={defaultShoppingForm}
        submitLabel="Save item"
        submitting={create.isPending}
        onSubmit={values =>
          create.mutate(values, {
            onSuccess: () => {
              toast('Item added', { detail: values.title });
              router.dismissTo('/shopping' as Href);
            },
            onError: e => handleError(e, toast),
          })
        }
      />
    </Screen>
  );
}
