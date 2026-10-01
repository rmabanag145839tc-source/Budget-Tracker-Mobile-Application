import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/expenseTrackerTheme';

// The number is the actual percent of this month's budget left.
export default function SafetyGauge({ percent }) {
  const color = percent < 30 ? colors.coral : colors.green;

  return (
    <View style={[styles.ring, { borderColor: color }]}>
      <Text style={[styles.number, { color }]}>{percent}%</Text>
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
