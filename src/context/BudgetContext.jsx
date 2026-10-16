import React, { createContext, useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
import {
  getMonthlyBudget,
  setMonthlyBudget,
  getSavingsGoal,
  setSavingsGoal,
} from '../database/settingsQueries';
import { colors } from '../theme/expenseTrackerTheme';
import { availableForExpense, roundMoney } from '../utils/budgetMath';
import { formatPeso } from '../utils/formatPeso';

const BudgetContext = createContext(null);

export const startingCategories = STARTING_CATEGORIES;

// Read the saved records together so every screen receives the latest values.
function readSavedData() {
  initDatabase();
  return {
    expenses: getAllExpenses(),
    categories: getCategoryNames(),
    monthlyBudget: getMonthlyBudget(),
    savingsGoal: getSavingsGoal(),
    error: '',
  };
}

// SQLite saves the data. These state values are copies used to refresh the screens.
export function BudgetProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      return readSavedData();
    } catch (error) {
      console.error('Database startup failed:', error);
      return { expenses: [], categories: [], monthlyBudget: 0, savingsGoal: 0, error: 'Could not open saved data.' };
    }
  });
  const { expenses, categories, monthlyBudget, savingsGoal, error: loadError } = data;

  function refresh() {
    setData(readSavedData());
  }

  function loadSavedData() {
    try {
      refresh();
    } catch (error) {
      setData((current) => ({ ...current, error: 'Could not open saved data.' }));
      console.error('Database startup failed:', error);
    }
  }

  function saveExpense(details) {
    if (!Number.isFinite(details.amount) || roundMoney(details.amount) <= 0) {
      throw new Error('Enter an amount of at least ₱0.01.');
    }
    const amount = roundMoney(details.amount);
    const available = availableForExpense(expenses, monthlyBudget, details.date, details.id);
    const original = expenses.find((expense) => expense.id === details.id);
    // Allow corrections that reduce an old expense, even if that month is already over budget.
    const isReduction = original
      && original.date.slice(0, 7) === details.date.slice(0, 7)
      && amount <= original.amount;
    if (amount > available && !isReduction) {
      const shortfall = roundMoney(amount - available);
      const error = new Error(
        `Insufficient balance. Add at least ${formatPeso(shortfall)} to your monthly budget before saving.`
      );
      error.code = 'INSUFFICIENT_BALANCE';
      throw error;
    }
    // The form uses a category name; the database stores its matching ID.
    const categoryId = getCategoryIdByName(details.category);
    if (!categoryId) throw new Error('Choose an available category.');

    const record = {
      amount,
      description: details.description,
      date: details.date,
      categoryId,
    };

    // An existing ID means edit; otherwise, create a new expense.
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
    // Keep expenses from pointing to a category that no longer exists.
    if (countExpensesInCategory(name) > 0) {
      throw new Error('Delete or edit its expenses first.');
    }
    removeCategory(name);
    refresh();
  }

  function updateMonthlyBudget(amount) {
    if (!Number.isFinite(amount) || amount < 0) throw new Error('Enter zero or a positive budget.');
    setMonthlyBudget(roundMoney(amount));
    refresh();
  }

  function updateSavingsGoal(amount) {
    if (!Number.isFinite(amount) || amount < 0) throw new Error('Enter zero or a positive goal.');
    setSavingsGoal(roundMoney(amount));
    refresh();
  }

  if (loadError) {
    return (
      <View style={styles.messageScreen}>
        <Text style={styles.message}>{loadError}</Text>
        <Pressable onPress={loadSavedData} style={styles.retryButton}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  // Screens call useBudget() to read these values and save changes.
  return (
    <BudgetContext.Provider
      value={{
        expenses,
        categories,
        monthlyBudget,
        savingsGoal,
        saveExpense,
        deleteExpense,
        addCategory,
        renameCategory,
        deleteCategory,
        updateMonthlyBudget,
        updateSavingsGoal,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  return useContext(BudgetContext);
}

const styles = StyleSheet.create({
  messageScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: { color: colors.text, textAlign: 'center', fontSize: 16 },
  retryButton: { backgroundColor: colors.navy, borderRadius: 10, padding: 14, marginTop: 16 },
  retryText: { color: colors.text, fontWeight: '700' },
});
