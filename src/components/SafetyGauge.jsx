import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/expenseTrackerTheme';

// The number is the actual percent of this month's budget left.
export default function SafetyGauge({ percent }) {
  return (
    <View style={styles.ring}>
      <Text style={styles.number}>{percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 7,
    borderColor: colors.green,
    borderLeftColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    color: colors.green,
    fontSize: 16,
    fontWeight: '600',
  },
});