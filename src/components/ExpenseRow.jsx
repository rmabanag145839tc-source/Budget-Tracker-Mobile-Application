import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppIcon, { categoryIconName } from './AppIcon';
import { colors } from '../theme/expenseTrackerTheme';
import { formatPeso } from '../utils/formatPeso';

export default function ExpenseRow({ expense, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.row} accessibilityRole="button">
      <View style={styles.iconBadge}>
        <AppIcon name={categoryIconName(expense.category)} color={colors.green} size={19} />
      </View>
      <View style={styles.details}>
        <Text style={styles.description} numberOfLines={1}>{expense.description}</Text>
        <Text style={styles.category} numberOfLines={1}>
          {expense.category} · {expense.date}
        </Text>
      </View>
      <Text style={styles.amount}>-{formatPeso(expense.amount)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 68,
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    gap: 10,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
  },
  description: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  category: {
    color: colors.mutedText,
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    color: colors.coral,
    fontSize: 14,
    fontWeight: '700',
  },
});
