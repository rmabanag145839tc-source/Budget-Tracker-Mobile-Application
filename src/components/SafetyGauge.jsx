import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/expenseTrackerTheme';

// The number is the actual percent of this month's budget left.
export default function SafetyGauge({ percent, noBudget = false }) {
  const color = noBudget ? colors.mutedText : percent < 30 ? colors.coral : colors.green;

  return (
    <View style={[styles.ring, { borderColor: color }]}>
      <Text style={[styles.number, { color }]}>{noBudget ? '—' : `${percent}%`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 16,
    fontWeight: '600',
  },
});
