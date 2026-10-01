import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';
import { startingCategories, useBudget } from '../context/BudgetContext';
import { colors } from '../theme/expenseTrackerTheme';

export default function CategoriesScreen({ navigation }) {
  const { categories, expenses, addCategory, renameCategory, deleteCategory } = useBudget();
  const [newName, setNewName] = useState('');
  const [editingName, setEditingName] = useState('');
  const [draftName, setDraftName] = useState('');

  function nameIsTaken(name, currentName = '') {
    for (const category of categories) {
      if (category !== currentName && category.toLowerCase() === name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  function handleAdd() {
    const name = newName.trim();
    if (!name) {
      Alert.alert('Enter a category name.');
      return;
    }
    if (nameIsTaken(name)) {
      Alert.alert('That category already exists.');
      return;
    }

    addCategory(name);
    setNewName('');
  }

  function handleRename() {
    const name = draftName.trim();
    if (!name || nameIsTaken(name, editingName)) {
      Alert.alert('Enter a different category name.');
      return;
    }

    // Renaming also changes the category on any expenses that used it.
    renameCategory(editingName, name);
    setEditingName('');
  }

  function handleDelete(name) {
    if (expenses.some((expense) => expense.category === name)) {
      Alert.alert('Category in use', 'Delete or edit its expenses first.');
      return;
    }

    Alert.alert('Delete category?', name, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(name) },
    ]);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.phone}>
        <View style={styles.header}>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>Keep your spending organized</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <Text style={styles.help}>Choose a category when you add an expense.</Text>

          {/* Keep this form above the list so the keyboard does not cover it. */}
          <View style={styles.addCard}>
            <Text style={styles.label}>New category</Text>
            <TextInput
              accessibilityLabel="New category name"
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Example: Health"
              placeholderTextColor={colors.mutedText}
              maxLength={24}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />
            <Pressable accessibilityRole="button" onPress={handleAdd} style={styles.addButton}>
              <Text style={styles.buttonText}>Add category</Text>
            </Pressable>
          </View>

          <Text style={styles.listTitle}>Your categories</Text>
          {categories.map((name) => {
            const isBuiltIn = startingCategories.includes(name);

            return (
              <View key={name} style={styles.categoryRow}>
                {editingName === name ? (
                  <TextInput
                    accessibilityLabel="Edit category name"
                    style={styles.editInput}
                    value={draftName}
                    onChangeText={setDraftName}
                    maxLength={24}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {name}
                  </Text>
                )}

                {isBuiltIn && <Text style={styles.defaultText}>Default</Text>}

                {!isBuiltIn && editingName === name && (
                  <>
                    <Pressable accessibilityRole="button" onPress={handleRename}>
                      <Text style={styles.action}>Save</Text>
                    </Pressable>
                    <Pressable accessibilityRole="button" onPress={() => setEditingName('')}>
                      <Text style={styles.action}>Cancel</Text>
                    </Pressable>
                  </>
                )}
                {!isBuiltIn && editingName !== name && (
                  <>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setEditingName(name);
                        setDraftName(name);
                      }}
                    >
                      <Text style={styles.action}>Edit</Text>
                    </Pressable>
                    <Pressable accessibilityRole="button" onPress={() => handleDelete(name)}>
                      <Text style={styles.deleteAction}>Delete</Text>
                    </Pressable>
                  </>
                )}
              </View>
            );
          })}

        </ScrollView>

        <BottomTabs navigation={navigation} currentScreen="Categories" />
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
  },
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 13,
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  help: {
    color: colors.mutedText,
    marginTop: 20,
    marginBottom: 18,
    fontSize: 13,
  },
  addCard: {
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  listTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 6,
  },
  categoryRow: {
    minHeight: 58,
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  categoryName: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
  },
  defaultText: {
    color: colors.mutedText,
    fontSize: 11,
  },
  editInput: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
    borderBottomWidth: 1,
    borderColor: colors.blue,
  },
  action: {
    color: colors.blue,
  },
  deleteAction: {
    color: colors.coral,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    color: colors.text,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  addButton: {
    backgroundColor: colors.navy,
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
});
