import React from 'react';
import { Text } from 'react-native';

// Simple text symbols keep the icons easy to read and change.
// Use these names in screens, for example: <AppIcon name="home" />.
const symbols = {
  food: '🍴',
  transport: '🚌',
  coffee: '☕',
  book: '▤',
  home: '⌂',
  history: '☷',
  add: '+',
  categories: '▦',
  back: '←',
  calendar: '▣',
  dropdown: '⌄',
};

export default function AppIcon({ name, color, size = 20 }) {
  return <Text style={{ color, fontSize: size }}>{symbols[name]}</Text>;
}
