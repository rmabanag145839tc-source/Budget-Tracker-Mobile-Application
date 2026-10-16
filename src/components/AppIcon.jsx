import React from 'react';
import { Text, View } from 'react-native';

// Simple symbols avoid hard-to-read SVG paths.
const symbols = {
  food: '🍴',
  transport: '🚌',
  shopping: '🛍️',
  bills: '🧾',
  tag: '🏷️',
  home: '⌂',
  history: '≡',
  analytics: '▥',
  add: '+',
  categories: '▦',
  back: '←',
  calendar: '▣',
  dropdown: '▾',
};
const categoryIcons = { Food: 'food', Transport: 'transport', Shopping: 'shopping', Bills: 'bills' };

// Custom category names use a tag, so they always have an icon too.
export function categoryIconName(category) {
  return categoryIcons[category] || 'tag';
}

export default function AppIcon({ name, color, size = 20 }) {
  // The fixed box keeps different symbols centered in the same space.
  return (
    <View
      style={{
        width: size + 10,
        height: size + 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        allowFontScaling={false}
        style={{
          color,
          fontSize: size,
          lineHeight: size + 4,
          textAlign: 'center',
          includeFontPadding: false,
        }}
      >
        {symbols[name]}
      </Text>
    </View>
  );
}
