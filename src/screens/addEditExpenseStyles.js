import { StyleSheet } from 'react-native';
import { colors } from '../theme/expenseTrackerTheme';

// All visual sizes and colors for AddEditExpenseScreen live here.
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
  categoryChoices: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
  },
  categoryChoice: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dateInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  error: {
    color: colors.coral,
    marginTop: 12,
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

export default styles;
