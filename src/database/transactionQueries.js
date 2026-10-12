import db from './db';

// Every query returns the same shape the screens already use:
// { id, amount, category, date, description }
const SELECT_EXPENSES = `
  SELECT t.id, t.amount, t.description, t.date, c.name AS category
    FROM transactions t
    JOIN categories c ON c.id = t.category_id
`;

// CREATE (date is 'YYYY-MM-DD')
export function insertExpense({ amount, description, date, categoryId }) {
  return db.runSync(
    'INSERT INTO transactions (amount, description, date, category_id) VALUES (?, ?, ?, ?)',
    [amount, description, date, categoryId]
  );
}

// READ
export function getAllExpenses() {
  return db.getAllSync(`${SELECT_EXPENSES} ORDER BY t.date DESC, t.id DESC`);
}

export function getExpensesByCategory(name) {
  return db.getAllSync(`${SELECT_EXPENSES} WHERE c.name = ? ORDER BY t.date DESC, t.id DESC`, [
    name,
  ]);
}

// month is 'YYYY-MM'
export function getMonthlyTotal(month) {
  const row = db.getFirstSync(
    "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE strftime('%Y-%m', date) = ?",
    [month]
  );
  return row.total;
}

// UPDATE
export function updateExpense({ id, amount, description, date, categoryId }) {
  return db.runSync(
    'UPDATE transactions SET amount = ?, description = ?, date = ?, category_id = ? WHERE id = ?',
    [amount, description, date, categoryId, id]
  );
}

// DELETE
export function deleteExpenseById(id) {
  return db.runSync('DELETE FROM transactions WHERE id = ?', [id]);
}
