import React, { createContext, useContext, useState } from 'react';
import { initDatabase, STARTING_CATEGORIES } from '../database/db';
import {
  countExpensesInCategory,
  getCategoryIdByName,
  getCategoryNames,
  insertCategory,
  removeCategory,
  updateCategoryName,
} from '../database/categoryQueries';
import {
  deleteExpenseById,
  getAllExpenses,
  insertExpense,
  updateExpense,
} from '../database/transactionQueries';
import { getMonthlyBudget } from '../database/settingsQueries';

const BudgetContext = createContext(null);

export const startingCategories = STARTING_CATEGORIES;

// Data now lives in SQLite. React state is a copy that makes screens re-render.
export function BudgetProvider({ children }) {
  const [expenses, setExpenses] = useState(() => {
    initDatabase();
    return getAllExpenses();
  });
  const [categories, setCategories] = useState(() => getCategoryNames());
  const [monthlyBudget] = useState(() => getMonthlyBudget());

  // Reload from the database after every change so screens always match what is saved.
  function refresh() {
    setExpenses(getAllExpenses());
    setCategories(getCategoryNames());
  }

  function saveExpense(details) {
    const categoryId = getCategoryIdByName(details.category);
    if (!categoryId) return;

    const record = {
      amount: details.amount,
      description: details.description,
      date: details.date,
      categoryId,
    };

    // An existing ID means update that row. Otherwise insert a new one.
    if (details.id) {
      updateExpense({ id: details.id, ...record });
    } else {
      insertExpense(record);
    }
    refresh();
  }

  function deleteExpense(id) {
    deleteExpenseById(id);
    refresh();
  }

  function addCategory(name) {
    insertCategory(name);
    refresh();
  }

  function renameCategory(oldName, newName) {
    updateCategoryName(oldName, newName);
    refresh();
  }

  function deleteCategory(name) {
    // The screen already warns first; this guard keeps the database consistent either way.
    if (countExpensesInCategory(name) > 0) return;
    removeCategory(name);
    refresh();
  }

  return (
    <BudgetContext.Provider
      value={{
        expenses,
        categories,
        monthlyBudget,
        saveExpense,
        deleteExpense,
        addCategory,
        renameCategory,
        deleteCategory,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

// Screens use this hook to read or change the same saved data.
export function useBudget() {
  return useContext(BudgetContext);
}
