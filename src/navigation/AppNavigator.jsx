import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddEditExpenseScreen from '../screens/AddEditExpenseScreen';
import { colors } from '../theme/expenseTrackerTheme';

const Stack = createNativeStackNavigator();

// Use the same colors as the screens so navigation matches the app design.
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.card,
    border: colors.border,
    text: colors.text,
    primary: colors.green,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        {/* Screen names are used when moving between screens. */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddExpense" component={AddEditExpenseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
