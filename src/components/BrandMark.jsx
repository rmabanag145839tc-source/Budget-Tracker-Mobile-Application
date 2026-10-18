import React from 'react';
import { Image } from 'react-native';

// The same logo is used for the app icon and inside each screen header.
export default function BrandMark({ size = 32 }) {
  return (
    <Image
      source={require('../../assets/icon.png')}
      style={{ width: size, height: size, borderRadius: size / 5 }}
      accessibilityLabel="Expense Tracker logo"
    />
  );
}
