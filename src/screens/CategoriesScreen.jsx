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
  const [error, setError] = useState('');

  function nameIsTaken(name, currentName = '') {
    return categories.some(
      (category) => category.toLowerCase() === name.toLowerCase() && category !== currentName
    );
  }

  function handleAdd() {
    const name = newName.trim();
    if (!name) {
      setError('Enter a category name.');
      return;
    }
    if (nameIsTaken(name)) {
      setError('That category already exists.');
      return;
    }

    addCategory(name);
    setNewName('');
    setError('');
  }

  function handleRename() {
    const name = draftName.trim();
    if (!name || nameIsTaken(name, editingName)) {
      setError('Enter a different category name.');
      return;
    }

    // Renaming also changes the category on any expenses that used it.
    renameCategory(editingName, name);
    setEditingName('');
    setError('');
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
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.help}>Choose a category when you add an expense.</Text>
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
                    autoFocus
                  />
                ) : (
                  <Text style={styles.categoryName}>{name}</Text>
                )}

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
                        setError('');
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

          <Text style={styles.label}>New category</Text>
          <TextInput
            accessibilityLabel="New category name"
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Example: Health"
            placeholderTextColor={colors.mutedText}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable accessibilityRole="button" onPress={handleAdd} style={styles.addButton}>
            <Text style={styles.buttonText}>Add category</Text>
          </Pressable>
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
    padding: 20,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  help: {
    color: colors.mutedText,
    marginVertical: 20,
  },
  categoryRow: {
    minHeight: 54,
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  categoryName: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
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
    color: colors.mutedText,
    marginTop: 28,
    marginBottom: 8,
  },
  input: {
    color: colors.text,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    paddingHorizontal: 12,
    height: 44,
  },
  error: {
    color: colors.coral,
    marginTop: 8,
  },
  addButton: {
    backgroundColor: colors.navy,
    borderRadius: 7,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '700',
  },
});
