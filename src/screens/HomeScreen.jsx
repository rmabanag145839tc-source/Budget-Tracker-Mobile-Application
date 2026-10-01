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
            <Text style={styles.eyebrow}>MONTHLY OVERVIEW</Text>
            <Text style={styles.name}>Your budget</Text>
            <Text style={styles.balanceLabel}>Remaining balance</Text>
            <Text style={[styles.balance, remaining < 0 && styles.negativeBalance]}>
              {remaining < 0 ? '-' : ''}${Math.abs(remaining).toFixed(2)}
            </Text>
            <View style={styles.balanceSummary}>
              <View>
                <Text style={styles.summaryLabel}>BUDGET</Text>
                <Text style={styles.summaryValue}>${monthlyBudget.toFixed(2)}</Text>
              </View>
              <View>
                <Text style={styles.summaryLabel}>SPENT</Text>
                <Text style={styles.summaryValue}>${monthlySpending.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.dashboard}>
            <View style={styles.safetyCard}>
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

            <Text style={styles.sectionTitle}>This month by category</Text>
            <View style={styles.categoryRow}>
              {dashboardCategories.map((name) => (
                <View key={name} style={styles.categoryCard}>
                  <View style={styles.categoryIcon}>
                    <AppIcon
                      name={categoryIcons[name] || 'categories'}
                      color={categoryColors[name] || colors.green}
                      size={18}
                    />
                  </View>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {name}
                  </Text>
                  <Text style={styles.categoryAmount}>${categoryTotal(name).toFixed(2)}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Recent activity</Text>
            {expenses.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Nothing spent yet</Text>
                <Text style={styles.emptyText}>Tap + below to add your first expense.</Text>
              </View>
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
    minHeight: 230,
    backgroundColor: colors.navy,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  eyebrow: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 5,
  },
  balanceLabel: {
    color: colors.mutedText,
    fontSize: 14,
    marginTop: 24,
  },
  balance: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '700',
    marginTop: 2,
  },
  negativeBalance: {
    color: colors.coral,
  },
  balanceSummary: {
    borderTopWidth: 1,
    borderColor: colors.navyBorder,
    flexDirection: 'row',
    gap: 36,
    marginTop: 22,
    paddingTop: 14,
  },
  summaryLabel: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 3,
  },
  dashboard: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -18,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
  },
  safetyCard: {
    minHeight: 112,
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 12,
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
    gap: 10,
    marginTop: 10,
    marginBottom: 24,
  },
  categoryCard: {
    width: 124,
    minHeight: 112,
    backgroundColor: colors.smallCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 34,
    height: 34,
    backgroundColor: colors.navy,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    color: colors.mutedText,
    fontSize: 12,
  },
  categoryAmount: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 24,
  },
  emptyCard: {
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 13,
    marginTop: 5,
  },
});
