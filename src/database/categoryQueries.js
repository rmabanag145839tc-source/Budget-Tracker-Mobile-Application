import db from './db';

// CREATE
export function insertCategory(name) {
  return db.runSync('INSERT INTO categories (name) VALUES (?)', [name.trim()]);
}

// READ (names only, because the screens work with category names)
export function getCategoryNames() {
  return db.getAllSync('SELECT name FROM categories ORDER BY id ASC').map((row) => row.name);
}

export function getCategoryIdByName(name) {
  const row = db.getFirstSync('SELECT id FROM categories WHERE name = ?', [name]);
  return row ? row.id : null;
}

export function countExpensesInCategory(name) {
  const row = db.getFirstSync(
    `SELECT COUNT(*) AS count
       FROM transactions t JOIN categories c ON c.id = t.category_id
      WHERE c.name = ?`,
    [name]
  );
  return row.count;
}

// UPDATE (expenses follow automatically because they point to the category id)
export function updateCategoryName(oldName, newName) {
  return db.runSync('UPDATE categories SET name = ? WHERE name = ?', [newName.trim(), oldName]);
}

// DELETE (blocked by the database if any expense still uses the category)
export function removeCategory(name) {
  return db.runSync('DELETE FROM categories WHERE name = ?', [name]);
}
