import React from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppIcon from '../components/AppIcon';
import { useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';

export default function ExpenseDetailsScreen({ navigation, route }) {
  const { expenses, deleteExpense } = useBudget();
  const expense = expenses.find((item) => item.id === route.params?.expenseId);

  function confirmDelete() {
    Alert.alert('Delete expense?', 'This removes it from the current app session.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteExpense(expense.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.phone}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <AppIcon name="back" color={colors.text} size={22} />
          </Pressable>
          <Text style={styles.title}>Expense details</Text>
        </View>

        {expense ? (
          <View style={styles.content}>
            <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
            <Detail label="Description" value={expense.description} />
            <Detail label="Category" value={expense.category} />
            <Detail label="Date" value={expense.date} />

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.push('AddExpense', { expenseId: expense.id })}
              style={styles.editButton}
            >
              <Text style={styles.buttonText}>Edit expense</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={confirmDelete} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete expense</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.missing}>This expense is no longer available.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

function Detail({ label, value }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
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
    height: 57,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  amount: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 20,
  },
  detail: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
  },
  label: {
    color: colors.mutedText,
    fontSize: 13,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: colors.navy,
    borderRadius: 7,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '700',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: colors.coral,
    borderRadius: 7,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteText: {
    color: colors.coral,
    fontWeight: '700',
  },
  missing: {
    color: colors.mutedText,
    padding: 20,
  },
});
