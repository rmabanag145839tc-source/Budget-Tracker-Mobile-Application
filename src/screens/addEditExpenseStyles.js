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
    height: 68,
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
    fontSize: 21,
    fontWeight: '700',
    marginLeft: 8,
  },
  form: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 36,
  },
  label: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 22,
    marginBottom: 8,
  },
  amountBox: {
    height: 76,
    backgroundColor: colors.smallCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    color: colors.green,
    fontSize: 32,
    fontWeight: '700',
    marginRight: 3,
  },
  amount: {
    flex: 1,
    height: 60,
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  field: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.input,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: colors.text,
    fontSize: 16,
  },
  selectedField: {
    borderColor: colors.blue,
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
    borderRadius: 12,
    marginTop: 6,
    overflow: 'hidden',
  },
  categoryChoice: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  datePickerPanel: {
    backgroundColor: colors.input,
    borderRadius: 12,
    marginTop: 8,
    paddingBottom: 8,
  },
  dateDoneButton: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateDoneText: {
    color: colors.blue,
    fontWeight: '700',
  },
  error: {
    color: colors.coral,
    marginTop: 12,
  },
  saveButton: {
    height: 52,
    backgroundColor: colors.navy,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  saveText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default styles;
