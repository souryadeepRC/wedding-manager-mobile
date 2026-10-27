import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { PageHeader, Screen, useToast } from '@/components';
import { useTheme } from '@/theme';
import { handleError } from '@/utils/errors';
import { ChecklistForm } from './components/ChecklistForm';
import { useCreateChecklist } from './hooks/useChecklistMutations';
import { defaultChecklistForm } from './checklist.schema';

export function AddChecklistScreen() {
  const router = useRouter();
  const toast = useToast();
  const { tileAccents } = useTheme();
  // Opened from a suggestion on the empty checklist with the task prefilled.
  const { title } = useLocalSearchParams<{ title?: string }>();
  const create = useCreateChecklist();
  return (
    <Screen scroll keyboardAvoiding edges={['top', 'left', 'right', 'bottom']} glow={[tileAccents[3], tileAccents[1]]}>
      <PageHeader title="Add task" onBack={router.back} />
      <ChecklistForm
        initialValues={{ ...defaultChecklistForm, title: title ?? '' }}
        submitLabel="Save task"
        submitting={create.isPending}
        onSubmit={values =>
          create.mutate(values, {
            onSuccess: () => {
              toast('Task added', { detail: values.title });
              router.dismissTo('/checklist' as Href);
            },
            onError: e => handleError(e, toast),
          })
        }
      />
    </Screen>
  );
}
