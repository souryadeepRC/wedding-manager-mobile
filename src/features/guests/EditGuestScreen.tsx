import { useLocalSearchParams, useRouter } from 'expo-router';
import { ErrorState, PageHeader, Screen, Skeleton, useToast } from '@/components';
import { confirm } from '@/utils/confirm';
import { handleError } from '@/utils/errors';
import { GuestForm } from './components/GuestForm';
import { toGuestFormValues } from './guest.schema';
import { useGuest } from './hooks/useGuest';
import { useDeleteGuest, useUpdateGuest } from './hooks/useGuestMutations';

export function EditGuestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data: guest, isPending, isError, refetch } = useGuest(id);
  const update = useUpdateGuest(id);
  const remove = useDeleteGuest(id);

  const header = <PageHeader title="Edit guest" onBack={router.back} />;
  if (isPending) {
    return (
      <Screen>
        {header}
        <Skeleton height={64} />
        <Skeleton height={64} />
        <Skeleton height={64} />
      </Screen>
    );
  }
  if (isError) {
    return <Screen>{header}<ErrorState title="Couldn't load this guest" message="Nothing's lost. Give it another try." onRetry={refetch} /></Screen>;
  }

  const onDelete = async () => {
    if (!(await confirm('Delete guest?', `${guest.title} will be removed permanently.`, 'Delete', 'Cancel'))) return;
    remove.mutate(undefined, {
      onSuccess: () => {
        toast('Guest deleted');
        router.dismissTo('/guests');
      },
      onError: e => handleError(e, toast),
    });
  };

  return (
    <Screen scroll keyboardAvoiding>
      {header}
      <GuestForm
        initialValues={toGuestFormValues(guest)}
        submitLabel="Save changes"
        submitting={update.isPending}
        onSubmit={values =>
          update.mutate(values, {
            onSuccess: () => {
              toast('Guest updated');
              router.dismissTo('/guests');
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
