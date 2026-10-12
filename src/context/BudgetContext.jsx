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
import { getMonthlyBudget, setMonthlyBudget } from '../database/settingsQueries';
import { colors } from '../theme/expenseTrackerTheme';

const BudgetContext = createContext(null);

export const startingCategories = STARTING_CATEGORIES;

function readSavedData() {
  initDatabase();
  return {
    expenses: getAllExpenses(),
    categories: getCategoryNames(),
    monthlyBudget: getMonthlyBudget(),
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
      return { expenses: [], categories: [], monthlyBudget: 0, error: 'Could not open saved data.' };
    }
  });
  const { expenses, categories, monthlyBudget, error: loadError } = data;

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
    const categoryId = getCategoryIdByName(details.category);
    if (!categoryId) throw new Error('Choose an available category.');

    const record = {
      amount: details.amount,
      description: details.description,
      date: details.date,
      categoryId,
    };

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
    if (countExpensesInCategory(name) > 0) {
      throw new Error('Delete or edit its expenses first.');
    }
    removeCategory(name);
    refresh();
  }

  function updateMonthlyBudget(amount) {
    setMonthlyBudget(amount);
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
        updateMonthlyBudget,
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
