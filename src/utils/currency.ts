const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const grouped = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export const formatINR = (n: number) => inr.format(n);
// Indian digit grouping without the ₹ sign, for amount inputs ("2,50,000").
export const formatAmount = (n: number) => grouped.format(n);
