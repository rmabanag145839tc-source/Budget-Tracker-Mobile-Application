import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/expenseTrackerTheme';

export default function ExpenseRow({ expense, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.row} accessibilityRole="button">
      <View style={styles.details}>
        <Text style={styles.description}>{expense.description}</Text>
        <Text style={styles.category}>
          {expense.category} · {expense.date}
        </Text>
      </View>
      <Text style={styles.amount}>-${expense.amount.toFixed(2)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    gap: 8,
  },
  details: {
    flex: 1,
  },
  description: {
    color: colors.text,
    fontSize: 14,
  },
  category: {
    color: colors.mutedText,
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    color: colors.coral,
    fontSize: 14,
  },
});
