import { useLocalSearchParams, useRouter } from 'expo-router';
import { ErrorState, PageHeader, Screen, Skeleton, useToast } from '@/components';
import { useTheme } from '@/theme';
import { confirm } from '@/utils/confirm';
import { handleError } from '@/utils/errors';
import { PaymentForm } from './components/PaymentForm';
import { toPaymentFormValues } from './expense.schema';
import { useExpenseData } from './hooks/useExpenseData';
import { useDeletePayment, useUpdatePayment } from './hooks/useExpenseMutations';

export function EditPaymentScreen() {
  const { id, paymentId } = useLocalSearchParams<{ id: string; paymentId: string }>();
  const router = useRouter();
  const toast = useToast();
  const { tileAccents } = useTheme();
  const { expenses, paymentsByExpense, isLoading, isError, refetch } = useExpenseData();
  const update = useUpdatePayment(paymentId);
  const remove = useDeletePayment(paymentId);
  const expense = expenses.find(e => e.id === id);
  const payment = paymentsByExpense.get(id)?.find(p => p.id === paymentId);

  const header = <PageHeader title="Edit payment" subtitle={expense?.title} onBack={router.back} />;
  if (isLoading) return <Screen>{header}<Skeleton height={64} /><Skeleton height={64} /></Screen>;
  if (isError || !expense || !payment) {
    return <Screen>{header}<ErrorState title="Couldn't load this payment" message="Your payments are safe. Let's try again." onRetry={refetch} /></Screen>;
  }

  const onDelete = async () => {
    if (!(await confirm('Delete payment?', 'The amount will be added back to the balance.', 'Delete', 'Cancel'))) return;
    remove.mutate(undefined, {
      onSuccess: () => {
        toast('Payment deleted');
        router.back();
      },
      onError: e => handleError(e, toast),
    });
  };

  return (
    <Screen scroll keyboardAvoiding glow={[tileAccents[4], tileAccents[1]]}>
      {header}
      <PaymentForm
        initialValues={toPaymentFormValues(payment)}
        maxAmount={expense.remaining + payment.amount}
        editing
        submitLabel="Save changes"
        submitting={update.isPending}
        onSubmit={values =>
          update.mutate(values, {
            onSuccess: () => {
              toast('Payment updated');
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
