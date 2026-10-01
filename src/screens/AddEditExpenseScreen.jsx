import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import AppIcon from '../components/AppIcon';
import { useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';
import styles from './addEditExpenseStyles';

function todayAsText() {
  // The date field uses YYYY-MM-DD (for example, 2026-10-01).
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDate(text) {
  const parts = text.split('-');
  if (text.length !== 10 || parts.length !== 3) return false;

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const date = new Date(year, month - 1, day);

  // JavaScript fixes dates such as February 31, so compare the result.
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

export default function AddEditExpenseScreen({ navigation, route }) {
  const { expenses, categories, saveExpense } = useBudget();
  const expenseId = route.params?.expenseId;
  // An ID means we are editing. Without one, this is a new expense.
  const expenseToEdit = expenses.find((expense) => expense.id === expenseId);

  // TextInputs keep text while the user types. We convert amount when saving.
  const [amount, setAmount] = useState(expenseToEdit ? String(expenseToEdit.amount) : '');
  const [category, setCategory] = useState(expenseToEdit?.category || 'Transport');
  const [date, setDate] = useState(expenseToEdit?.date || todayAsText());
  const [description, setDescription] = useState(expenseToEdit?.description || '');
  const [showCategories, setShowCategories] = useState(false);
  const [error, setError] = useState('');

  function handleSave() {
    const numberAmount = Number(amount);

    if (!Number.isFinite(numberAmount) || numberAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }
    if (!isValidDate(date)) {
      setError('Enter a real date as YYYY-MM-DD.');
      return;
    }
    if (!description.trim()) {
      setError('Enter a description.');
      return;
    }

    // Saving updates the shared React state, so the other screens refresh.
    saveExpense({
      id: expenseToEdit?.id,
      amount: numberAmount,
      category,
      date,
      description: description.trim(),
    });
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.phone}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AppIcon name="back" color={colors.text} size={22} />
          </Pressable>
          <Text style={styles.title}>{expenseToEdit ? 'Edit expense' : 'Add expense'}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Amount</Text>
          <TextInput
            accessibilityLabel="Amount"
            style={styles.amount}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="$0.00"
            placeholderTextColor={colors.mutedText}
          />

          <Text style={styles.label}>Category</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose category"
            onPress={() => setShowCategories((current) => !current)}
            style={[styles.field, styles.selectedField]}
          >
            <Text style={styles.fieldText}>{category}</Text>
            <AppIcon name="dropdown" color={colors.text} />
          </Pressable>
          {showCategories && (
            <View style={styles.categoryChoices}>
              {categories.map((choice) => (
                <Pressable
                  key={choice}
                  onPress={() => {
                    setCategory(choice);
                    setShowCategories(false);
                  }}
                  style={styles.categoryChoice}
                >
                  <Text style={styles.fieldText}>{choice}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <Text style={styles.label}>Date</Text>
          <View style={styles.field}>
            <TextInput
              accessibilityLabel="Date"
              style={styles.dateInput}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.mutedText}
              maxLength={10}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Use today's date"
              onPress={() => setDate(todayAsText())}
            >
              <AppIcon name="calendar" color={colors.text} />
            </Pressable>
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            accessibilityLabel="Description"
            style={styles.field}
            value={description}
            onChangeText={setDescription}
            placeholder="What was this for?"
            placeholderTextColor={colors.mutedText}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable accessibilityRole="button" onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>{expenseToEdit ? 'Save changes' : 'Save expense'}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
