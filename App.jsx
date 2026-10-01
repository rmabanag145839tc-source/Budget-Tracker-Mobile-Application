import AppNavigator from './src/navigation/AppNavigator';
import { useEffect } from 'react';
import { initDatabase } from './src/database/db';

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return <AppNavigator />;
}