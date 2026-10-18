import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon, { categoryIconName } from '../components/AppIcon';
import BottomTabs from '../components/BottomTabs';
import BrandMark from '../components/BrandMark';
import { useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';
import { analyticsPeriod } from '../utils/analyticsDates';
import { totalExpenses } from '../utils/budgetMath';
import { formatPeso } from '../utils/formatPeso';

const filters = [
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly' },
  { key: 'threeMonths', label: '3 months' },
  { key: 'year', label: 'Yearly' },
];

function displayDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function AnalyticsScreen({ navigation }) {
  const { expenses, categories } = useBudget();
  const [filter, setFilter] = useState('month');
  // Zero is the current period; -1 is the previous period.
  const [offset, setOffset] = useState(0);
  const { start, end } = analyticsPeriod(filter, offset);
  const selectedExpenses = expenses.filter((expense) => expense.date >= start && expense.date < end);
  const total = totalExpenses(selectedExpenses);
  // Build one total per category, then show the biggest amounts first.
  const categoryTotals = categories
    .map((name) => ({
      name,
      total: totalExpenses(selectedExpenses.filter((expense) => expense.category === name)),
    }))
    .filter((category) => category.total > 0)
    .sort((a, b) => b.total - a.total);

  // Yearly and three-month views also show each month's spending, including empty months.
  const monthlyTotals = [];
  if (filter === 'year' || filter === 'threeMonths') {
    const [year, month] = start.split('-').map(Number);
    const count = filter === 'year' ? 12 : 3;
    for (let index = 0; index < count; index += 1) {
      const date = new Date(year, month - 1 + index, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyTotals.push({
        key,
        label: date.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' }),
        total: totalExpenses(selectedExpenses.filter((expense) => expense.date.startsWith(key))),
      });
    }
  }
  const [endYear, endMonth, endDay] = end.split('-').map(Number);
  const lastDay = new Date(endYear, endMonth - 1, endDay - 1);
  let periodLabel;
  if (filter === 'month') {
    const [year, month] = start.split('-').map(Number);
    periodLabel = new Date(year, month - 1, 1).toLocaleDateString('en-PH', {
      month: 'long', year: 'numeric',
    });
  } else if (filter === 'year') {
    periodLabel = start.slice(0, 4);
  } else {
    const lastDayLabel = lastDay.toLocaleDateString('en-PH', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
    periodLabel = `${displayDate(start)} – ${lastDayLabel}`;
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.phone}>
        <View style={styles.header}>
          <Text style={styles.title}>Spending analytics</Text>
          <BrandMark />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.help}>Explore your saved expenses by date. Weeks start on Monday.</Text>
          <View style={styles.filters}>
            {filters.map((item) => (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityState={{ selected: filter === item.key }}
                onPress={() => {
                  setFilter(item.key);
                  setOffset(0);
                }}
                style={[styles.filter, filter === item.key && styles.selected]}
              >
                <Text style={styles.filterText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.periodRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous period"
              onPress={() => setOffset(offset - 1)}
              style={styles.arrow}
            >
              <Text style={styles.arrowText}>‹</Text>
            </Pressable>
            <Text style={styles.period}>{periodLabel}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next period"
              onPress={() => setOffset(offset + 1)}
              style={styles.arrow}
            >
              <Text style={styles.arrowText}>›</Text>
            </Pressable>
          </View>
          <Pressable accessibilityRole="button" onPress={() => setOffset(0)} style={styles.reset}>
            <Text style={styles.link}>Back to current period</Text>
          </Pressable>
          <View style={styles.summary}>
            <Text style={styles.help}>TOTAL SPENT</Text>
            <Text style={styles.total}>{formatPeso(total)}</Text>
            <Text style={styles.help}>
              {selectedExpenses.length} {selectedExpenses.length === 1 ? 'expense' : 'expenses'} in this period
            </Text>
          </View>
          <Text style={styles.sectionTitle}>By category</Text>
          {categoryTotals.length === 0 && (
            <Text style={styles.help}>
              No expenses for these dates. Choose another period to see past spending.
            </Text>
          )}
          {categoryTotals.map((category) => (
            <View key={category.name} style={styles.category}>
              <View style={styles.row}>
                <AppIcon name={categoryIconName(category.name)} color={colors.green} size={18} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.value}>{formatPeso(category.total)}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${category.total / total * 100}%` }]} />
              </View>
              <Text style={styles.share}>{Math.round(category.total / total * 100)}% of spending</Text>
            </View>
          ))}
          {monthlyTotals.length > 0 && <Text style={styles.sectionTitle}>By month</Text>}
          {monthlyTotals.map((month) => (
            <View key={month.key} style={styles.monthRow}>
              <Text style={styles.categoryName}>{month.label}</Text>
              <Text style={styles.value}>{formatPeso(month.total)}</Text>
            </View>
          ))}
        </ScrollView>
        <BottomTabs navigation={navigation} currentScreen="Analytics" />
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
    minHeight: 68,
    backgroundColor: colors.navy,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '700',
    flexShrink: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  help: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 20,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 20,
  },
  filter: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.navy,
    borderColor: colors.green,
  },
  filterText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  period: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  arrow: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.smallCard,
    borderRadius: 10,
  },
  arrowText: {
    color: colors.green,
    fontSize: 28,
  },
  reset: {
    alignSelf: 'center',
    padding: 12,
  },
  link: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '600',
  },
  summary: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  total: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 6,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 26,
    marginBottom: 14,
  },
  category: {
    backgroundColor: colors.smallCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryName: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginTop: 10,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  share: {
    color: colors.mutedText,
    fontSize: 11,
    marginTop: 7,
  },
  monthRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
});
