import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { PageHeader, Screen, useToast } from '@/components';
import { useTheme } from '@/theme';
import { handleError } from '@/utils/errors';
import { ExpenseForm } from './components/ExpenseForm';
import { defaultExpenseForm } from './expense.schema';
import { useCreateExpense } from './hooks/useExpenseMutations';

export function AddExpenseScreen() {
  const router = useRouter();
  const toast = useToast();
  const { tileAccents } = useTheme();
  // Opened from a suggestion chip ("Venue", "Caterer"...) with the title prefilled.
  const { title } = useLocalSearchParams<{ title?: string }>();
  const create = useCreateExpense();
  return (
    <Screen scroll keyboardAvoiding glow={[tileAccents[0], tileAccents[1]]}>
      <PageHeader title="Add expense" onBack={router.back} />
      <ExpenseForm
        initialValues={{ ...defaultExpenseForm, title: title ?? '' }}
        submitLabel="Save expense"
        submitting={create.isPending}
        onSubmit={values =>
          create.mutate(values, {
            onSuccess: () => {
              toast('Expense added', { detail: values.title });
              router.dismissTo('/expenses' as Href);
            },
            onError: e => handleError(e, toast),
          })
        }
      />
    </Screen>
  );
}
