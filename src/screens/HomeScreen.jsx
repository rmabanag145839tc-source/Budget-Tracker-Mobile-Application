import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabs from '../components/BottomTabs';
import ExpenseRow from '../components/ExpenseRow';
import SafetyGauge from '../components/SafetyGauge';
import AppIcon, { categoryIconName } from '../components/AppIcon';
import BrandMark from '../components/BrandMark';
import { useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';
import { formatPeso } from '../utils/formatPeso';
import { roundMoney, totalExpenses } from '../utils/budgetMath';

const categoryColors = { Food: colors.coral, Transport: colors.blue };

export default function HomeScreen({ navigation }) {
  const { expenses, categories, monthlyBudget, savingsGoal } = useBudget();
  const today = new Date();
  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  // Only expenses dated this month change the monthly budget figures.
  const monthlyExpenses = expenses.filter((expense) => expense.date.startsWith(thisMonth));
  // A category appears on Home once it has an expense this month.
  const dashboardCategories = categories.filter((name) =>
    monthlyExpenses.some((expense) => expense.category === name)
  );
  const monthlySpending = totalExpenses(monthlyExpenses);
  const remaining = roundMoney(monthlyBudget - monthlySpending);
  const hasBudget = monthlyBudget > 0;
  // The gauge shows 0–100% of the budget left; overspending cannot make it negative.
  let safetyScore = hasBudget ? Math.round((remaining / monthlyBudget) * 100) : 0;
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
    return roundMoney(total);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.phone}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.balanceCard}>
            <View style={styles.topRow}>
              <Text style={styles.eyebrow}>MONTHLY OVERVIEW</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit monthly budget"
                onPress={() => navigation.navigate('BudgetSettings')}
                style={styles.budgetButton}
              >
                <Text style={styles.editBudget}>Budget & goal</Text>
              </Pressable>
            </View>

            <View style={styles.brandRow}>
              <BrandMark size={30} />
              <Text style={styles.name}>Expense Tracker</Text>
            </View>
            <Text style={styles.balanceLabel}>Remaining balance</Text>
            <Text style={[styles.balance, remaining < 0 && styles.negativeBalance]}>
              {formatPeso(remaining)}
            </Text>
            <View style={styles.balanceSummary}>
              <View>
                <Text style={styles.summaryLabel}>BUDGET</Text>
                <Text style={styles.summaryValue}>{formatPeso(monthlyBudget)}</Text>
              </View>
              <View>
                <Text style={styles.summaryLabel}>SPENT</Text>
                <Text style={styles.summaryValue}>{formatPeso(monthlySpending)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.dashboard}>
            <View style={styles.safetyCard}>
              <SafetyGauge percent={safetyScore} noBudget={!hasBudget} />
              <View>
                <Text style={[styles.safetyTitle, hasBudget && safetyScore < 30 && styles.lowBudget]}>
                  {!hasBudget ? 'Set your budget' : safetyScore >= 30 ? 'Budget safe' : 'Budget low'}
                </Text>
                <Text style={styles.smallText}>
                  {!hasBudget
                    ? 'Tap Budget & goal to begin'
                    : safetyScore >= 30 ? "You're on track" : 'Watch your spending'}
                </Text>
              </View>
            </View>

            {/* This is a goal for the money left over, not a separate savings account. */}
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('BudgetSettings')}
              style={styles.emptyCard}
            >
              <Text style={styles.emptyTitle}>Monthly savings goal</Text>
              <Text style={styles.emptyText}>
                {savingsGoal > 0
                  ? `Keep ${formatPeso(savingsGoal)} of your budget at month end.`
                  : 'Set an amount you want to keep at month end.'}
              </Text>
              {savingsGoal > 0 && (
                <>
                  <Text style={styles.emptyText}>Amount left now: {formatPeso(remaining)}</Text>
                  <Text style={[styles.goalStatus, remaining < savingsGoal && styles.lowBudget]}>
                    {remaining >= savingsGoal
                      ? 'On track — keep your remaining balance above your goal.'
                      : `${formatPeso(roundMoney(savingsGoal - remaining))} below your goal.`}
                  </Text>
                </>
              )}
              <Text style={styles.editBudget}>Manage goal →</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>This month by category</Text>
            {dashboardCategories.length === 0 ? (
              <Text style={styles.emptyCategory}>Categories appear here after you add an expense.</Text>
            ) : (
              <View style={styles.categoryRow}>
                {dashboardCategories.map((name) => (
                  <View key={name} style={styles.categoryCard}>
                    <View style={styles.categoryIcon}>
                      <AppIcon
                        name={categoryIconName(name)}
                        color={categoryColors[name] || colors.green}
                        size={18}
                      />
                    </View>
                    <Text style={styles.categoryName} numberOfLines={1}>
                      {name}
                    </Text>
                    <Text style={styles.categoryAmount}>{formatPeso(categoryTotal(name))}</Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.sectionTitle}>Recent activity</Text>
            {/* Recent activity uses all dates, while the budget above uses this month only. */}
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
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  editBudget: { color: colors.green, fontSize: 12, fontWeight: '700' },
  budgetButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 9 },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
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
  emptyCategory: { color: colors.mutedText, fontSize: 13, marginTop: 10, marginBottom: 20 },
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
  goalStatus: { color: colors.green, fontSize: 13, lineHeight: 20, marginVertical: 10 },
});
