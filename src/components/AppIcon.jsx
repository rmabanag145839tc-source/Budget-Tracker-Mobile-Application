import React from 'react';
import { Text, View } from 'react-native';

// Simple symbols avoid hard-to-read SVG paths.
const symbols = {
  food: '🍴',
  transport: '🚌',
  home: '⌂',
  history: '≡',
  add: '+',
  categories: '▦',
  back: '←',
  calendar: '▣',
  dropdown: '▾',
};

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
