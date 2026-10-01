import React from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
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
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>EXPENSE AMOUNT</Text>
              <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.detailCard}>
              <Detail label="Description" value={expense.description} />
              <Detail label="Category" value={expense.category} />
              <Detail label="Date" value={expense.date} />
            </View>

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
          </ScrollView>
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
  },
  content: {
    padding: 22,
    paddingBottom: 36,
  },
  summaryCard: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: 22,
  },
  summaryLabel: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  amount: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '700',
    marginTop: 8,
  },
  detailCard: {
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  detail: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
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
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 22,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '700',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: colors.coral,
    borderRadius: 12,
    padding: 16,
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
