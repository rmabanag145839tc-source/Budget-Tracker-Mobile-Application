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
  function openTab(screen) {
    // A fresh add screen starts with empty fields every time.
    if (screen === 'AddExpense') {
      navigation.push('AddExpense');
    } else {
      navigation.navigate(screen);
    }
  }

  return (
    <View style={styles.bar}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.screen}
          accessibilityRole="button"
          accessibilityLabel={tab.label}
          onPress={() => openTab(tab.screen)}
          style={styles.button}
        >
          {currentScreen === tab.screen && <View style={styles.activeMark} />}
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
    height: 60,
    borderTopWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    backgroundColor: colors.card,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeMark: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.green,
  },
});
