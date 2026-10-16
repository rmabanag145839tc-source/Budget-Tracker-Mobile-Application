// Round at the centavo so normal money calculations do not gain extra decimals.
export function roundMoney(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function totalExpenses(expenses) {
  return roundMoney(expenses.reduce((total, expense) => total + expense.amount, 0));
}

// Check the month of the expense, even when entering an older receipt.
// Exclude the original expense when editing so it is not counted twice.
export function availableForExpense(expenses, monthlyBudget, date, expenseId) {
  const month = date.slice(0, 7);
  const otherExpenses = expenses.filter(
    (expense) => expense.id !== expenseId && expense.date.startsWith(month)
  );
  return roundMoney(monthlyBudget - totalExpenses(otherExpenses));
}
