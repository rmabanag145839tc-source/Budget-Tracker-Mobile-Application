import React, { createContext, useContext, useRef, useState } from 'react';

const BudgetContext = createContext(null);

export const startingCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

// All demo data lives here. It resets when the app restarts.
export function BudgetProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState(startingCategories);
  // Each expense needs a different ID so edit and delete can find it later.
  const nextId = useRef(1);
  // Starter budget for this UI stage. A budget setting can replace it later.
  const monthlyBudget = 1000;

  function saveExpense(details) {
    // An existing ID means replace that expense. Otherwise add a new one.
    if (details.id) {
      setExpenses((current) =>
        current.map((expense) => {
          if (expense.id === details.id) return details;
          return expense;
        })
      );
      return;
    }

    const newExpense = { ...details, id: nextId.current };
    nextId.current += 1;
    setExpenses((current) => [newExpense, ...current]);
  }

  function deleteExpense(id) {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  }

  function addCategory(name) {
    setCategories((current) => [...current, name]);
  }

  function renameCategory(oldName, newName) {
    // Keep the category list and any expenses using that name in sync.
    setCategories((current) =>
      current.map((name) => {
        if (name === oldName) return newName;
        return name;
      })
    );
    setExpenses((current) =>
      current.map((expense) => {
        if (expense.category === oldName) return { ...expense, category: newName };
        return expense;
      })
    );
  }

  function deleteCategory(name) {
    setCategories((current) => current.filter((category) => category !== name));
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

// Screens use this hook to read or change the same in-memory data.
export function useBudget() {
  return useContext(BudgetContext);
}
