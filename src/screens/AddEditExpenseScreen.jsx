import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AppIcon from '../components/AppIcon';
import { colors } from '../theme/expenseTrackerTheme';

// This form is a picture of the screen for now. It does not save anything yet.
export default function AddEditExpenseScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.phone}>
        <View style={styles.header}>
          {/* Return to the dashboard screen. */}
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => navigation.goBack()} style={styles.backButton}>
            <AppIcon name="back" color={colors.text} size={22} />
          </Pressable>
          <Text style={styles.title}>Add expense</Text>
        </View>

        {/* These fixed values are examples for the mockup, not saved expenses. */}
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.label}>Amount</Text>
          <TextInput style={styles.amount} value="$0.00" editable={false} />

          <Text style={styles.label}>Category</Text>
          <View style={[styles.field, styles.selectedField]}>
            <Text style={styles.fieldText}>Transport</Text>
            <AppIcon name="dropdown" color={colors.text} />
          </View>

          <Text style={styles.label}>Date</Text>
          <View style={styles.field}>
            <Text style={styles.fieldText}>09/22/2026</Text>
            <AppIcon name="calendar" color={colors.text} />
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput style={styles.field} value="Bus Fee" editable={false} />

          <Pressable accessibilityRole="button" style={styles.saveButton}>
            <Text style={styles.saveText}>Save expense</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  phone: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  header: {
    height: 57,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 34,
    height: 44,
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  form: {
    padding: 20,
  },
  label: {
    color: colors.mutedText,
    fontSize: 14,
    marginTop: 16,
    marginBottom: 6,
  },
  amount: {
    height: 50,
    color: colors.text,
    fontSize: 35,
    fontWeight: '600',
  },
  field: {
    minHeight: 43,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    backgroundColor: colors.input,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: colors.text,
    fontSize: 16,
  },
  selectedField: {
    borderColor: '#0870cd',
    borderWidth: 1.5,
  },
  fieldText: {
    color: colors.text,
    fontSize: 16,
  },
  saveButton: {
    height: 45,
    backgroundColor: colors.navy,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  saveText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
