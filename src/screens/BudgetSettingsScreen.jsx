import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AppIcon from '../components/AppIcon';
import BrandMark from '../components/BrandMark';
import { useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';

export default function BudgetSettingsScreen({ navigation }) {
  const { monthlyBudget, updateMonthlyBudget } = useBudget();
  const [amount, setAmount] = useState(String(monthlyBudget));
  const [error, setError] = useState('');

  function handleSave() {
    const newBudget = Number(amount);
    if (!amount.trim() || !Number.isFinite(newBudget) || newBudget < 0) {
      setError('Enter zero or a positive budget.');
      return;
    }

    try {
      updateMonthlyBudget(newBudget);
      navigation.goBack();
    } catch (saveError) {
      console.error('Budget save failed:', saveError);
      setError('Could not save your budget. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.phone}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <AppIcon name="back" color={colors.text} size={22} />
          </Pressable>
          <Text style={styles.title}>Monthly budget</Text>
          <View style={styles.headerLogo}><BrandMark /></View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <Text style={styles.help}>Set the amount you want to spend this month. You can enter zero to clear it.</Text>
          <Text style={styles.label}>Budget amount</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currency}>₱</Text>
            <TextInput
              accessibilityLabel="Monthly budget amount"
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.mutedText}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable accessibilityRole="button" onPress={handleSave} style={styles.button}>
            <Text style={styles.buttonText}>Save budget</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, alignItems: 'center' },
  phone: { flex: 1, width: '100%', maxWidth: 430, backgroundColor: colors.card },
  header: {
    height: 68,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
  },
  title: { color: colors.text, fontSize: 21, fontWeight: '700' },
  headerLogo: { marginLeft: 'auto' },
  content: { padding: 22 },
  help: { color: colors.mutedText, fontSize: 14, marginBottom: 28 },
  label: { color: colors.mutedText, fontSize: 13, marginBottom: 8 },
  inputRow: {
    height: 64,
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  currency: { color: colors.green, fontSize: 26, fontWeight: '700', marginRight: 4 },
  input: { flex: 1, color: colors.text, fontSize: 26, height: 56 },
  error: { color: colors.coral, marginTop: 12 },
  button: {
    height: 52,
    backgroundColor: colors.navy,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonText: { color: colors.text, fontSize: 15, fontWeight: '700' },
});
