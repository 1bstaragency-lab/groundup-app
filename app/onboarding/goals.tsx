import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import SelectableCard from '../../components/SelectableCard';
import ContinueButton from '../../components/ContinueButton';
import { Colors, Spacing, FontSize } from '../../constants/theme';

const MAX_GOALS = 3;

const OPTIONS = [
  'Drop my first release',
  'Build a fanbase',
  'Stay consistent',
  'Get on playlists',
  'Monetize my music',
  'Build my brand',
  'Grow on social',
  'Get industry access',
];

export default function GoalsScreen() {
  const goals = useOnboardingStore((s) => s.goals);
  const setGoals = useOnboardingStore((s) => s.setGoals);

  const toggle = (item: string) => {
    if (goals.includes(item)) {
      setGoals(goals.filter((g) => g !== item));
    } else if (goals.length < MAX_GOALS) {
      setGoals([...goals, item]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What are your goals?</Text>
        <Text style={styles.subtitle}>Pick up to 3</Text>
        <Text style={styles.count}>{goals.length}/{MAX_GOALS} selected</Text>

        <View style={styles.grid}>
          {OPTIONS.map((option) => (
            <View key={option} style={styles.gridItem}>
              <SelectableCard
                label={option}
                selected={goals.includes(option)}
                onPress={() => toggle(option)}
                mode="checkbox"
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ContinueButton
          onPress={() => router.push('/onboarding/building')}
          disabled={goals.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  title: {
    color: Colors.white,
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: FontSize.md,
    marginBottom: Spacing.xs,
  },
  count: {
    color: Colors.secondary,
    fontSize: FontSize.md,
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridItem: {
    width: '48%',
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
  },
});
