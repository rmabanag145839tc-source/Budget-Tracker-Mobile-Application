import AppNavigator from './src/navigation/AppNavigator';
import { BudgetProvider } from './src/context/BudgetContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// One provider lets every screen see the same expenses and categories.
export default function App() {
  return (
    // Measure the status bar, camera cutout, and bottom gesture area for every screen.
    <SafeAreaProvider>
      <BudgetProvider>
        <AppNavigator />
      </BudgetProvider>
    </SafeAreaProvider>
  );
}
