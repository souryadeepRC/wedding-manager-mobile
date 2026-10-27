import { useLocalSearchParams, useRouter } from 'expo-router';
import { PageHeader, Screen, useToast } from '@/components';
import { handleError } from '@/utils/errors';
import { GuestForm } from './components/GuestForm';
import { defaultGuestForm } from './guest.schema';
import { useCreateGuest } from './hooks/useGuestMutations';

export function AddGuestScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const eventType = type === 'reception' ? 'reception' : 'wedding';
  const toast = useToast();
  const create = useCreateGuest();
  return (
    <Screen scroll keyboardAvoiding>
      <PageHeader title="Add guest" onBack={router.back} />
      <GuestForm
        initialValues={{ ...defaultGuestForm, eventType }}
        submitLabel="Save guest"
        submitting={create.isPending}
        onSubmit={values =>
          create.mutate(values, {
            onSuccess: () => {
              toast('Guest added');
              router.dismissTo('/guests');
            },
            onError: e => handleError(e, toast),
          })
        }
      />
    </Screen>
  );
}
