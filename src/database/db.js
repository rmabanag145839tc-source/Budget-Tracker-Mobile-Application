import * as SQLite from 'expo-sqlite';

// One local database file on the phone. Data stays after the app closes.
const db = SQLite.openDatabaseSync('expensetracker.db');

export const STARTING_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills'];
export const STARTING_MONTHLY_BUDGET = 0;

let isReady = false;

// Creates the tables the first time the app runs. Safe to call more than once.
export function initDatabase() {
  if (isReady) return;

  db.execSync('PRAGMA foreign_keys = ON;');

  db.withTransactionSync(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS categories (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL UNIQUE COLLATE NOCASE,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        amount      REAL NOT NULL CHECK (amount > 0),
        description TEXT NOT NULL,
        date        TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        created_at  TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS settings (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category_id);
    `);

    // The marker keeps an intentionally empty category list empty on later launches.
    const seeded = db.getFirstSync("SELECT value FROM settings WHERE key = 'categories_seeded'");
    if (!seeded) {
      const { count } = db.getFirstSync('SELECT COUNT(*) AS count FROM categories');
      if (count === 0) {
        STARTING_CATEGORIES.forEach((name) => {
          db.runSync('INSERT INTO categories (name) VALUES (?)', [name]);
        });
      }
      db.runSync("INSERT INTO settings (key, value) VALUES ('categories_seeded', '1')");
    }

    db.runSync("INSERT OR IGNORE INTO settings (key, value) VALUES ('monthly_budget', ?)", [
      String(STARTING_MONTHLY_BUDGET),
    ]);
  });

  isReady = true;
}

export default db;
