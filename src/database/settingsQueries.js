import db from './db';

export function getMonthlyBudget() {
  const row = db.getFirstSync("SELECT value FROM settings WHERE key = 'monthly_budget'");
  return row ? Number(row.value) : 0;
}

export function setMonthlyBudget(amount) {
  return db.runSync(
    `INSERT INTO settings (key, value) VALUES ('monthly_budget', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [String(amount)]
  );
}
