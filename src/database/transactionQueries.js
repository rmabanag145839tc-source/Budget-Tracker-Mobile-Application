import db from './db'

export const addTransaction = (amount, description, date, categoryId) => {
    return db.runSync(
        'INSERT INTO transactions (amount, description, date, category_id) VALUES (?, ?, ?, ?)',
        [amount, description, date, categoryId]
    );
};

export const getAllTransactions = () => {
    return db.getAllSync('SELECT * FROM transactions ORDER BY date DESC');
};

export const updateTransaction = (id, amount, description, date, categoryId) => {
    return db.runSync(
        'UPDATE transactions SET amount = ?, description = ?, date = ?, category_id = ?, WHERE id = ?',
        [amount, description, date, categoryId, id]
    );
};