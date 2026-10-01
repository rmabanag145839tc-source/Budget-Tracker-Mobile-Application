import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';
import ExpenseRow from '../components/ExpenseRow';
import SafetyGauge from '../components/SafetyGauge';
import AppIcon from '../components/AppIcon';
import { useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';

const categoryIcons = { Food: 'food', Transport: 'transport' };
const categoryColors = { Food: colors.coral, Transport: colors.blue };

export default function HomeScreen({ navigation }) {
  const { expenses, categories, monthlyBudget } = useBudget();
  const today = new Date();
  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  // Only expenses dated this month change the monthly budget figures.
  const monthlyExpenses = expenses.filter((expense) => expense.date.startsWith(thisMonth));
  // Keep the mockup's two cards; show any other category after it has spending this month.
  const dashboardCategories = categories.filter(
    (name) =>
      name === 'Food' ||
      name === 'Transport' ||
      monthlyExpenses.some((expense) => expense.category === name)
  );
  const monthlySpending = monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
  const remaining = monthlyBudget - monthlySpending;
  let safetyScore = Math.round((remaining / monthlyBudget) * 100);
  if (safetyScore < 0) {
    safetyScore = 0;
  }
  if (safetyScore > 100) {
    safetyScore = 100;
  }

  function categoryTotal(name) {
    let total = 0;
    for (const expense of monthlyExpenses) {
      if (expense.category === name) {
        total += expense.amount;
      }
    }
    return total;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.phone}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.balanceCard}>
            <Text style={styles.mutedText}>Monthly budget preview</Text>
            <Text style={styles.name}>Overview</Text>
            <Text style={[styles.mutedText, styles.balanceLabel]}>Remaining balance</Text>
            <Text style={[styles.balance, remaining < 0 && styles.negativeBalance]}>
              {remaining < 0 ? '-' : ''}${Math.abs(remaining).toFixed(2)}
            </Text>
            <Text style={styles.budgetNote}>
              Monthly budget ${monthlyBudget.toFixed(2)} · Spent ${monthlySpending.toFixed(2)}
            </Text>
          </View>

          <View style={styles.dashboard}>
            <View style={styles.safetyRow}>
              <SafetyGauge percent={safetyScore} />
              <View>
                <Text style={[styles.safetyTitle, safetyScore < 30 && styles.lowBudget]}>
                  {safetyScore >= 30 ? 'Budget safe' : 'Budget low'}
                </Text>
                <Text style={styles.smallText}>
                  {safetyScore >= 30 ? "You're on track" : 'Watch your spending'}
                </Text>
              </View>
            </View>

            <View style={styles.categoryRow}>
              {dashboardCategories.map((name) => (
                <View key={name} style={styles.categoryCard}>
                  <AppIcon
                    name={categoryIcons[name] || 'categories'}
                    color={categoryColors[name] || colors.green}
                  />
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {name}
                  </Text>
                  <Text style={styles.categoryAmount}>${categoryTotal(name).toFixed(2)}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Recent activity</Text>
            {expenses.length === 0 ? (
              <Text style={styles.emptyText}>No expenses yet. Tap + to add one.</Text>
            ) : (
              expenses.slice(0, 3).map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  onPress={() => navigation.navigate('ExpenseDetails', { expenseId: expense.id })}
                />
              ))
            )}
          </View>
        </ScrollView>
        <BottomTabs navigation={navigation} currentScreen="Home" />
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
  scroll: {
    flex: 1,
  },
  balanceCard: {
    minHeight: 190,
    backgroundColor: colors.navy,
    padding: 20,
    paddingBottom: 24,
  },
  mutedText: {
    color: colors.mutedText,
    fontSize: 14,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  balanceLabel: {
    marginTop: 12,
  },
  balance: {
    color: colors.text,
    fontSize: 31,
    fontWeight: '700',
  },
  negativeBalance: {
    color: colors.coral,
  },
  budgetNote: {
    color: colors.mutedText,
    fontSize: 12,
    marginTop: 6,
  },
  dashboard: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: -1,
    padding: 20,
  },
  safetyRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  safetyTitle: {
    color: colors.green,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  lowBudget: {
    color: colors.coral,
  },
  smallText: {
    color: colors.mutedText,
    fontSize: 13,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  categoryCard: {
    width: 120,
    minHeight: 78,
    backgroundColor: colors.smallCard,
    borderRadius: 11,
    padding: 10,
    justifyContent: 'center',
  },
  categoryName: {
    color: colors.text,
    fontSize: 13,
  },
  categoryAmount: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    color: colors.mutedText,
    fontSize: 14,
    paddingBottom: 8,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 14,
    paddingVertical: 14,
  },
});
