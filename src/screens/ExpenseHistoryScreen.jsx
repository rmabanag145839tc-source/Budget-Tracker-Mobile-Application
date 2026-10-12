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
          <Text style={styles.subtitle}>
            {expenses.length === 1 ? '1 expense recorded' : `${expenses.length} expenses recorded`}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
          contentContainerStyle={styles.filterContent}
        >
          {['All', ...categories].map((name) => (
            <Pressable
              key={name}
              accessibilityRole="button"
              onPress={() => setFilter(name)}
              style={[styles.filter, selectedFilter === name && styles.selectedFilter]}
            >
              <Text style={[styles.filterText, selectedFilter === name && styles.selectedFilterText]}>
                {name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView style={styles.list}>
          {visibleExpenses.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Nothing to show yet</Text>
              <Text style={styles.emptyText}>
                {expenses.length === 0
                  ? 'Tap + to add your first expense.'
                  : 'Try another category to see its expenses.'}
              </Text>
            </View>
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
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 13,
    marginTop: 5,
  },
  filters: {
    flexGrow: 0,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  filter: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.smallCard,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: colors.navy,
    borderColor: colors.green,
  },
  filterText: {
    color: colors.mutedText,
    fontSize: 13,
  },
  selectedFilterText: {
    color: colors.text,
    fontWeight: '700',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyCard: {
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
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
