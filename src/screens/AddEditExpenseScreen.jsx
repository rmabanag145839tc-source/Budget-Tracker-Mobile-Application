import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import AppIcon from '../components/AppIcon';
import BrandMark from '../components/BrandMark';
import { useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';
import styles from './addEditExpenseStyles';
import { availableForExpense, roundMoney } from '../utils/budgetMath';
import { formatPeso } from '../utils/formatPeso';

function dateForStorage(date) {
  // Expenses store dates as YYYY-MM-DD so monthly totals are easy to calculate.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateFromStorage(savedDate) {
  if (!savedDate) return new Date();
  // JavaScript months start at zero, so January in the saved date becomes month 0.
  const [year, month, day] = savedDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function AddEditExpenseScreen({ navigation, route }) {
  const { expenses, categories, monthlyBudget, saveExpense } = useBudget();
  const expenseId = route.params?.expenseId;
  // An ID means we are editing. Without one, this is a new expense.
  const expenseToEdit = expenses.find((expense) => expense.id === expenseId);

  // TextInputs keep text while the user types. We convert amount when saving.
  const [amount, setAmount] = useState(expenseToEdit ? String(expenseToEdit.amount) : '');
  const [category, setCategory] = useState(expenseToEdit?.category || '');
  const [date, setDate] = useState(() => dateFromStorage(expenseToEdit?.date));
  const [description, setDescription] = useState(expenseToEdit?.description || '');
  const [showCategories, setShowCategories] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const available = availableForExpense(expenses, monthlyBudget, dateForStorage(date), expenseId);

  function openDatePicker() {
    // Android opens its date dialog; iOS shows the picker in this form.
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        onValueChange: (_, chosenDate) => {
          if (chosenDate) setDate(chosenDate);
        },
      });
    } else {
      setShowDatePicker(true);
    }
  }

  function handleSave() {
    // Inputs are text while typing, so check them before sending data to SQLite.
    const numberAmount = Number(amount);

    if (!Number.isFinite(numberAmount) || roundMoney(numberAmount) <= 0) {
      setError('Enter an amount of at least ₱0.01.');
      return;
    }
    if (!description.trim()) {
      setError('Enter a description.');
      return;
    }
    if (!category) {
      setError('Choose a category.');
      return;
    }

    try {
      // Save to SQLite, then refresh the shared state used by the other screens.
      saveExpense({
        id: expenseToEdit?.id,
        amount: numberAmount,
        category,
        date: dateForStorage(date),
        description: description.trim(),
      });
      navigation.goBack();
    } catch (saveError) {
      if (saveError.code === 'INSUFFICIENT_BALANCE') {
        setError(saveError.message);
        Alert.alert('Insufficient balance', saveError.message, [
          { text: 'Keep editing', style: 'cancel' },
          // Opening settings keeps this form in the stack, so typed details are preserved.
          {
            text: 'Add funds',
            onPress: () => {
              setError('');
              navigation.navigate('BudgetSettings');
            },
          },
        ]);
        return;
      }
      console.error('Expense save failed:', saveError);
      setError('Could not save the expense. Check the category and try again.');
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'right', 'bottom', 'left']}>
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
          <View style={styles.headerLogo}><BrandMark /></View>
        </View>

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountBox}>
            <Text style={styles.currencySymbol}>₱</Text>
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
          <Text style={styles.balanceHint}>
            Available for {date.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}: {formatPeso(available)}
            {expenseToEdit ? ' (excluding this expense)' : ''}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setError('');
              navigation.navigate('BudgetSettings');
            }}
          >
            <Text style={styles.budgetLink}>Manage budget / add funds</Text>
          </Pressable>

          <Text style={styles.label}>Category</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose category"
            onPress={() => setShowCategories((current) => !current)}
            style={[styles.field, styles.selectedField]}
          >
            <Text style={[styles.fieldText, !category && styles.placeholder]}>
              {category || 'Choose a category'}
            </Text>
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
                onValueChange={(_, chosenDate) => {
                  if (chosenDate) setDate(chosenDate);
                }}
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
