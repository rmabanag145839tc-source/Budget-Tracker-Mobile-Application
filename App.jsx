import AppNavigator from './src/navigation/AppNavigator';
import { BudgetProvider } from './src/context/BudgetContext';

// The app opens with navigation, which decides which screen to show.
// One provider lets every screen see the same expenses and categories.
export default function App() {
  return <AppNavigator />;
  return (
    <BudgetProvider>
      <AppNavigator />
    </BudgetProvider>
  );
}