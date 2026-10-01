import React, { useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import AppIcon from '../components/AppIcon';
import { useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';
import styles from './addEditExpenseStyles';

function dateForStorage(date) {
  // Expenses store dates as YYYY-MM-DD so monthly totals are easy to calculate.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateFromStorage(savedDate) {
  if (!savedDate) return new Date();
  const [year, month, day] = savedDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function AddEditExpenseScreen({ navigation, route }) {
  const { expenses, categories, saveExpense } = useBudget();
  const expenseId = route.params?.expenseId;
  // An ID means we are editing. Without one, this is a new expense.
  const expenseToEdit = expenses.find((expense) => expense.id === expenseId);

  // TextInputs keep text while the user types. We convert amount when saving.
  const [amount, setAmount] = useState(expenseToEdit ? String(expenseToEdit.amount) : '');
  const [category, setCategory] = useState(expenseToEdit?.category || 'Transport');
  const [date, setDate] = useState(() => dateFromStorage(expenseToEdit?.date));
  const [description, setDescription] = useState(expenseToEdit?.description || '');
  const [showCategories, setShowCategories] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');

  function openDatePicker() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        onValueChange: (_, chosenDate) => setDate(chosenDate),
      });
    } else {
      setShowDatePicker(true);
    }
  }

  function handleSave() {
    const numberAmount = Number(amount);

    if (!Number.isFinite(numberAmount) || numberAmount <= 0) {
      setError('Enter an amount greater than zero.');
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
      date: dateForStorage(date),
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

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountBox}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              accessibilityLabel="Amount"
              style={styles.amount}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.mutedText}
            />
          </View>

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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose date"
            style={styles.field}
            onPress={openDatePicker}
          >
            <Text style={styles.fieldText}>
              {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
            <AppIcon name="calendar" color={colors.text} />
          </Pressable>
          {showDatePicker && Platform.OS === 'ios' && (
            <View style={styles.datePickerPanel}>
              <DateTimePicker
                value={date}
                mode="date"
                display="inline"
                themeVariant="dark"
                onValueChange={(_, chosenDate) => setDate(chosenDate)}
              />
              <Pressable onPress={() => setShowDatePicker(false)} style={styles.dateDoneButton}>
                <Text style={styles.dateDoneText}>Done</Text>
              </Pressable>
            </View>
          )}

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
