import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { ErrorState, PageHeader, Screen, Skeleton, useToast } from '@/components';
import { confirm } from '@/utils/confirm';
import { handleError } from '@/utils/errors';
import { ExpenseForm } from './components/ExpenseForm';
import { toExpenseFormValues } from './expense.schema';
import { useExpenseData } from './hooks/useExpenseData';
import { useDeleteExpense, useUpdateExpense } from './hooks/useExpenseMutations';

export function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { expenses, isLoading, isError, refetch } = useExpenseData();
  const update = useUpdateExpense(id);
  const remove = useDeleteExpense(id);
  const expense = expenses.find(e => e.id === id);

  const header = <PageHeader title="Edit expense" onBack={router.back} />;
  if (isLoading) return <Screen>{header}<Skeleton height={64} /><Skeleton height={64} /></Screen>;
  if (isError || !expense) {
    return <Screen>{header}<ErrorState title="Couldn't load this expense" message="Your payments are safe. Let's try again." onRetry={refetch} /></Screen>;
  }

  const onDelete = async () => {
    if (!(await confirm('Delete expense?', `${expense.title} and all its payments will be removed permanently.`, 'Delete', 'Cancel'))) return;
    remove.mutate(undefined, {
      onSuccess: () => {
        toast('Expense deleted');
        router.dismissTo('/expenses' as Href);
      },
      onError: e => handleError(e, toast),
    });
  };

  return (
    <Screen scroll keyboardAvoiding>
      {header}
      <ExpenseForm
        initialValues={toExpenseFormValues(expense)}
        submitLabel="Save changes"
        submitting={update.isPending}
        onSubmit={values =>
          update.mutate(values, {
            onSuccess: () => {
              toast('Expense updated');
              router.back();
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
