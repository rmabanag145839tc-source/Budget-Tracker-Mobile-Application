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
  scrollContent: {
    paddingBottom: 32,
  },
  help: {
    color: colors.mutedText,
    marginTop: 20,
    marginBottom: 8,
  },
  listTitle: {
    color: colors.mutedText,
    fontSize: 14,
    marginTop: 24,
    marginBottom: 4,
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
    marginTop: 16,
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
  addButton: {
    backgroundColor: colors.navy,
    borderRadius: 7,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '700',
  },
});
