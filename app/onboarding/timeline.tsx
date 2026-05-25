import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import SelectableCard from '../../components/SelectableCard';
import ContinueButton from '../../components/ContinueButton';
import { Colors, Spacing, FontSize } from '../../constants/theme';

const OPTIONS = [
  'This month',
  'Next 1-3 months',
  '3-6 months',
  'No release planned',
];

export default function TimelineScreen() {
  const releaseTimeline = useOnboardingStore((s) => s.releaseTimeline);
  const setReleaseTimeline = useOnboardingStore((s) => s.setReleaseTimeline);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>When's your next release?</Text>

        <View style={styles.stack}>
          {OPTIONS.map((option) => (
            <SelectableCard
              key={option}
              label={option}
              selected={releaseTimeline === option}
              onPress={() => setReleaseTimeline(option)}
              mode="radio"
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ContinueButton
          onPress={() => router.push('/onboarding/building')}
          disabled={releaseTimeline.length === 0}
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
    marginBottom: Spacing.lg,
  },
  stack: {
    gap: 12,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
  },
});
