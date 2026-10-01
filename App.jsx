import AppNavigator from './src/navigation/AppNavigator';
import { BudgetProvider } from './src/context/BudgetContext';

// One provider lets every screen see the same expenses and categories.
export default function App() {
  return (
    <BudgetProvider>
      <AppNavigator />
    </BudgetProvider>
  );
}
