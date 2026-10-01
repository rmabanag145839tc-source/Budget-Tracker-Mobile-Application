import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppIcon from './AppIcon';
import { colors } from '../theme/expenseTrackerTheme';

const tabs = [
  { screen: 'Home', icon: 'home', label: 'Home' },
  { screen: 'History', icon: 'history', label: 'History' },
  { screen: 'AddExpense', icon: 'add', label: 'Add expense' },
  { screen: 'Categories', icon: 'categories', label: 'Categories' },
];

export default function BottomTabs({ navigation, currentScreen }) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.screen}
          accessibilityRole="button"
          accessibilityLabel={tab.label}
          onPress={() => navigation.navigate(tab.screen)}
          style={styles.button}
        >
          <AppIcon
            name={tab.icon}
            color={currentScreen === tab.screen ? colors.green : colors.mutedText}
            size={23}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    borderTopWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    backgroundColor: colors.card,
  },
  button: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});