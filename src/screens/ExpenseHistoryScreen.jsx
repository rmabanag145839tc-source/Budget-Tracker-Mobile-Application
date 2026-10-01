import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';
import ExpenseRow from '../components/ExpenseRow';
import { useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';

export default function ExpenseHistoryScreen({ navigation }) {
  const { expenses, categories } = useBudget();
  const [filter, setFilter] = useState('All');
  // A renamed or deleted category should not leave the history stuck on an old filter.
  const selectedFilter = categories.includes(filter) ? filter : 'All';
  const visibleExpenses =
    selectedFilter === 'All'
      ? expenses
      : expenses.filter((expense) => expense.category === selectedFilter);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.phone}>
        <View style={styles.header}>
          <Text style={styles.title}>Expense history</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          {['All', ...categories].map((name) => (
            <Pressable
              key={name}
              accessibilityRole="button"
              onPress={() => setFilter(name)}
              style={[styles.filter, selectedFilter === name && styles.selectedFilter]}
            >
              <Text style={styles.filterText}>{name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView style={styles.list}>
          {visibleExpenses.length === 0 ? (
            <Text style={styles.emptyText}>
              {expenses.length === 0
                ? 'No expenses yet. Tap + to add one.'
                : 'No expenses in this category.'}
            </Text>
          ) : (
            visibleExpenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                onPress={() => navigation.navigate('ExpenseDetails', { expenseId: expense.id })}
              />
            ))
          )}
        </ScrollView>

        <BottomTabs navigation={navigation} currentScreen="History" />
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
    backgroundColor: colors.navy,
    padding: 20,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  filters: {
    flexGrow: 0,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  filter: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: colors.navy,
    borderColor: colors.blue,
  },
  filterText: {
    color: colors.text,
    fontSize: 13,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: colors.mutedText,
    marginTop: 20,
  },
});
