import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../components/AppIcon';
import BrandMark from '../components/BrandMark';
import { useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';
import { formatPeso } from '../utils/formatPeso';
import { roundMoney, totalExpenses } from '../utils/budgetMath';

export default function BudgetSettingsScreen({ navigation }) {
  const { expenses, monthlyBudget, savingsGoal, updateMonthlyBudget, updateSavingsGoal } = useBudget();
  // Keep typing separate from the saved budget until Save is pressed.
  const [amount, setAmount] = useState(String(monthlyBudget));
  const [funds, setFunds] = useState('');
  const [goal, setGoal] = useState(String(savingsGoal));
  const [message, setMessage] = useState('');
  const today = new Date();
  const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const spending = totalExpenses(expenses.filter((expense) => expense.date.startsWith(month)));

  function handleSave() {
    setMessage('');
    const newBudget = Number(amount);
    // Zero clears the budget; negative amounts and non-numbers are not valid.
    if (!amount.trim() || !Number.isFinite(newBudget) || newBudget < 0) {
      Alert.alert('Check budget', 'Enter zero or a positive budget.');
      return;
    }

    try {
      updateMonthlyBudget(newBudget);
      setAmount(String(roundMoney(newBudget)));
      setMessage('Monthly budget updated. Home now uses the new total.');
      Alert.alert('Budget updated', `Your monthly budget is now ${formatPeso(roundMoney(newBudget))}.`);
    } catch (saveError) {
      console.error('Budget save failed:', saveError);
      Alert.alert('Could not save budget', 'Please try again.');
    }
  }

  function handleAddFunds() {
    setMessage('');
    const extra = Number(funds);
    if (!funds.trim() || !Number.isFinite(extra) || roundMoney(extra) <= 0) {
      Alert.alert('Check amount', 'Enter at least ₱0.01 to add.');
      return;
    }
    try {
      // Add to the saved total, rather than replacing it with the top-up amount.
      const newTotal = roundMoney(monthlyBudget + extra);
      updateMonthlyBudget(newTotal);
      setAmount(String(newTotal));
      setFunds('');
      setMessage(`Added ${formatPeso(roundMoney(extra))}. Your budget is now ${formatPeso(newTotal)}.`);
      Alert.alert('Funds added', `Your monthly budget is now ${formatPeso(newTotal)}.`);
    } catch (saveError) {
      console.error('Add funds failed:', saveError);
      Alert.alert('Could not add funds', 'Please try again.');
    }
  }

  function handleSaveGoal() {
    setMessage('');
    const newGoal = Number(goal);
    if (!goal.trim() || !Number.isFinite(newGoal) || newGoal < 0) {
      Alert.alert('Check goal', 'Enter zero or a positive savings goal.');
      return;
    }
    try {
      updateSavingsGoal(newGoal);
      setGoal(String(roundMoney(newGoal)));
      setMessage(newGoal > 0 ? 'Savings goal saved. Check your progress on Home.' : 'Savings goal cleared.');
      Alert.alert('Goal updated', newGoal > 0 ? `Your monthly savings goal is ${formatPeso(roundMoney(newGoal))}.` : 'Savings goal cleared.');
    } catch (saveError) {
      console.error('Savings goal failed:', saveError);
      Alert.alert('Could not save goal', 'Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.phone}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
          >
            <AppIcon name="back" color={colors.text} size={22} />
          </Pressable>
          <Text style={styles.title}>Budget & goal</Text>
          <View style={styles.headerLogo}><BrandMark /></View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <View style={styles.summary}>
            <Text style={styles.label}>SAVED MONTHLY BUDGET</Text>
            <Text style={styles.savedAmount}>{formatPeso(monthlyBudget)}</Text>
            <Text style={styles.help}>Spent this month: {formatPeso(spending)}</Text>
            <Text style={styles.help}>Remaining: {formatPeso(roundMoney(monthlyBudget - spending))}</Text>
          </View>
          <Text style={styles.help}>This is a monthly spending allowance. The same budget applies to each month until you change it.</Text>
          {message ? <Text accessibilityLiveRegion="polite" style={styles.success}>{message}</Text> : null}
          <Text style={styles.sectionTitle}>Add funds</Text>
          <Text style={styles.help}>Increase your saved budget by this amount.</Text>
          <TextInput accessibilityLabel="Funds to add" style={styles.inputRow}
            value={funds} onChangeText={setFunds} keyboardType="decimal-pad"
            placeholder="Amount to add (₱)" placeholderTextColor={colors.mutedText} />
          <Pressable accessibilityRole="button" onPress={handleAddFunds} style={styles.button}>
            <Text style={styles.buttonText}>Add to budget</Text>
          </Pressable>
          <Text style={styles.sectionTitle}>Set total budget</Text>
          <Text style={styles.help}>Replace the full monthly budget. Enter zero to clear it.</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currency}>₱</Text>
            <TextInput
              accessibilityLabel="Monthly budget amount"
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.mutedText}
            />
          </View>
          <Pressable accessibilityRole="button" onPress={handleSave} style={styles.button}>
            <Text style={styles.buttonText}>Save total budget</Text>
          </Pressable>
          <Text style={styles.sectionTitle}>Monthly savings goal</Text>
          <Text style={styles.help}>How much of your budget do you want left at month end? This target does not add money or block spending. Enter zero to remove it.</Text>
          <TextInput accessibilityLabel="Monthly savings goal" style={styles.inputRow}
            value={goal} onChangeText={setGoal} keyboardType="decimal-pad"
            placeholder="Goal amount (₱)" placeholderTextColor={colors.mutedText} />
          <Pressable accessibilityRole="button" onPress={handleSaveGoal} style={styles.button}>
            <Text style={styles.buttonText}>Save savings goal</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  phone: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.card,
  },
  header: {
    height: 68,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '700',
    flexShrink: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerLogo: {
    marginLeft: 'auto',
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  help: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  summary: {
    backgroundColor: colors.navy,
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
  },
  savedAmount: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
  },
  label: {
    color: colors.mutedText,
    fontSize: 13,
    marginBottom: 8,
  },
  inputRow: {
    height: 64,
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 18,
  },
  currency: {
    color: colors.green,
    fontSize: 26,
    fontWeight: '700',
    marginRight: 4,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 26,
    height: 56,
  },
  success: {
    color: colors.green,
    marginTop: 12,
    lineHeight: 22,
  },
  button: {
    height: 52,
    backgroundColor: colors.navy,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
