import { useLocalSearchParams, useRouter } from 'expo-router';
import { ErrorState, PageHeader, Screen, Skeleton, useToast } from '@/components';
import { useTheme } from '@/theme';
import { formatINR } from '@/utils/currency';
import { handleError } from '@/utils/errors';
import { PaymentForm } from './components/PaymentForm';
import { defaultPaymentForm } from './expense.schema';
import { useExpenseData } from './hooks/useExpenseData';
import { useCreatePayment } from './hooks/useExpenseMutations';

export function AddPaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { tileAccents } = useTheme();
  const { expenses, isLoading, isError, refetch } = useExpenseData();
  const create = useCreatePayment(id);
  const expense = expenses.find(e => e.id === id);
  const header = <PageHeader title="Add payment" subtitle={expense?.title} onBack={router.back} />;

  if (isLoading) return <Screen>{header}<Skeleton height={64} /><Skeleton height={64} /></Screen>;
  if (isError || !expense) {
    return <Screen>{header}<ErrorState title="Couldn't load this expense" message="Your payments are safe. Let's try again." onRetry={refetch} /></Screen>;
  }

  return (
    <Screen scroll keyboardAvoiding glow={[tileAccents[5], tileAccents[1]]}>
      {header}
      <PaymentForm
        initialValues={defaultPaymentForm()}
        maxAmount={expense.remaining}
        submitLabel="Save payment"
        submitting={create.isPending}
        onSubmit={values =>
          create.mutate(values, {
            onSuccess: () => {
              const left = expense.remaining - values.amount;
              toast('Payment added', { detail: left > 0 ? `${formatINR(left)} left to pay` : 'Paid in full 🎉' });
              router.back();
            },
            onError: e => handleError(e, toast),
          })
        }
      />
    </Screen>
  );
}
