import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { ErrorState, PageHeader, Screen, Skeleton, useToast } from '@/components';
import { confirm } from '@/utils/confirm';
import { handleError } from '@/utils/errors';
import { ChecklistForm } from './components/ChecklistForm';
import { useChecklistItems } from './hooks/useChecklistItems';
import { useDeleteChecklist, useUpdateChecklist } from './hooks/useChecklistMutations';
import { toChecklistFormValues } from './checklist.schema';

// Pushed over the tabs, so this screen owns the bottom inset too.
const EDGES: ('top' | 'left' | 'right' | 'bottom')[] = ['top', 'left', 'right', 'bottom'];

export function EditChecklistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useChecklistItems();
  const update = useUpdateChecklist(id);
  const remove = useDeleteChecklist(id);
  const item = data?.find(i => i.id === id);

  const header = <PageHeader title="Edit task" onBack={router.back} />;
  if (isLoading) return <Screen edges={EDGES}>{header}<Skeleton height={64} /><Skeleton height={64} /></Screen>;
  if (isError || !item) {
    return <Screen edges={EDGES}>{header}<ErrorState title="Couldn't load this task" message="Your to-dos haven't gone anywhere. One more try?" onRetry={refetch} /></Screen>;
  }

  const onDelete = async () => {
    if (!(await confirm('Delete task?', `${item.title} will be removed permanently.`, 'Delete', 'Cancel'))) return;
    remove.mutate(undefined, {
      onSuccess: () => {
        toast('Task deleted');
        router.dismissTo('/checklist' as Href);
      },
      onError: e => handleError(e, toast),
    });
  };

  return (
    <Screen scroll keyboardAvoiding edges={EDGES}>
      {header}
      <ChecklistForm
        initialValues={toChecklistFormValues(item)}
        submitLabel="Save changes"
        submitting={update.isPending}
        onSubmit={values =>
          update.mutate(values, {
            onSuccess: () => {
              toast('Task updated');
              router.dismissTo('/checklist' as Href);
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
