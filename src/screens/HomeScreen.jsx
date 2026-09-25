import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppIcon from '../components/AppIcon';
import { colors } from '../theme/expenseTrackerTheme';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.phone}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Balance at the top of the dashboard */}
          <View style={styles.balanceCard}>
            <Text style={styles.mutedText}>Good Morning</Text>
            <Text style={styles.name}>John Doe</Text>
            <Text style={[styles.mutedText, styles.balanceLabel]}>Remaining balance</Text>
            <Text style={styles.balance}>$842.50</Text>
          </View>

          <View style={styles.dashboard}>
            {/* Budget safety ring */}
            <View style={styles.safetyRow}>
              <View style={styles.gauge}>
                <Text style={styles.gaugeText}>78%</Text>
              </View>
              <View>
                <Text style={styles.safetyTitle}>Budget safe</Text>
                <Text style={styles.smallText}>You&apos;re on track</Text>
              </View>
            </View>

            {/* Example spending totals */}
            <View style={styles.categoryRow}>
              <View style={styles.categoryCard}>
                <AppIcon name="food" color={colors.coral} />
                <Text style={styles.categoryName}>Food</Text>
                <Text style={styles.categoryAmount}>$210</Text>
              </View>
              <View style={styles.categoryCard}>
                <AppIcon name="transport" color={colors.blue} />
                <Text style={styles.categoryName}>Transport</Text>
                <Text style={styles.categoryAmount}>$64</Text>
              </View>
            </View>

            {/* Example recent expenses */}
            <Text style={styles.sectionTitle}>Recent activity</Text>
            <View style={styles.activityList}>
              <ActivityRow icon="coffee" title="Coffee shop" amount="-$4.50" />
              <ActivityRow icon="book" title="Textbook" amount="-$38.00" />
            </View>
          </View>
        </ScrollView>

        {/* The plus button opens the add screen. The other tabs are visual placeholders. */}
        <View style={styles.tabBar}>
          <TabIcon name="home" color={colors.green} label="Home" />
          <TabIcon name="history" color="#898d8e" label="History" />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add expense"
            onPress={() => navigation.navigate('AddExpense')}
            style={styles.tabButton}
          >
            <AppIcon name="add" color="#898d8e" size={23} />
          </Pressable>
          <TabIcon name="categories" color="#898d8e" label="Categories" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ActivityRow({ icon, title, amount }) {
  // Reuse this row layout for each example expense.
  return (
    <View style={styles.activityRow}>
      <AppIcon name={icon} color={colors.coral} size={19} />
      <Text style={styles.activityName}>{title}</Text>
      <Text style={styles.expenseAmount}>{amount}</Text>
    </View>
  );
}

function TabIcon({ name, color, label }) {
  return (
    <View accessibilityRole="image" accessibilityLabel={label} style={styles.tabButton}>
      <AppIcon name={name} color={color} size={23} />
    </View>
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
  balanceCard: {
    minHeight: 190,
    backgroundColor: colors.navy,
    padding: 20,
    paddingBottom: 24,
  },
  mutedText: {
    color: colors.mutedText,
    fontSize: 14,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  balanceLabel: {
    marginTop: 12,
  },
  balance: {
    color: colors.text,
    fontSize: 31,
    fontWeight: '700',
  },
  dashboard: {
    flex: 1,
    backgroundColor: colors.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: -1,
    padding: 20,
  },
  safetyRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  gauge: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 7,
    borderColor: colors.green,
    borderLeftColor: '#323738',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    color: colors.green,
    fontSize: 16,
    fontWeight: '600',
  },
  safetyTitle: {
    color: colors.green,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  smallText: {
    color: '#d2d4d5',
    fontSize: 13,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  categoryCard: {
    width: 80,
    minHeight: 78,
    backgroundColor: colors.smallCard,
    borderRadius: 11,
    padding: 10,
    justifyContent: 'center',
  },
  categoryName: {
    color: colors.text,
    fontSize: 13,
  },
  categoryAmount: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#d3d5d6',
    fontSize: 14,
    paddingBottom: 8,
  },
  activityList: {
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  activityRow: {
    height: 39,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  activityName: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
  },
  expenseAmount: {
    color: colors.coral,
    fontSize: 14,
  },
  tabBar: {
    height: 56,
    borderTopWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1d1e1e',
  },
  tabButton: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
