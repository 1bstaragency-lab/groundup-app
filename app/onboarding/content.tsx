import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import SelectableCard from '../../components/SelectableCard';
import ContinueButton from '../../components/ContinueButton';
import { Colors, Spacing, FontSize } from '../../constants/theme';

const LEVELS = [
  { label: 'I hate it', subtitle: "I'd rather do anything else" },
  { label: 'I struggle', subtitle: 'I try but it feels forced' },
  { label: "It's okay", subtitle: 'I can do it, just need direction' },
  { label: 'I love it', subtitle: 'Give me a strategy and I\'ll run' },
];

export default function ContentScreen() {
  const contentComfort = useOnboardingStore((s) => s.contentComfort);
  const setContentComfort = useOnboardingStore((s) => s.setContentComfort);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>How do you feel about content?</Text>

        <View style={styles.stack}>
          {LEVELS.map((level) => (
            <SelectableCard
              key={level.label}
              label={level.label}
              subtitle={level.subtitle}
              selected={contentComfort === level.label}
              onPress={() => setContentComfort(level.label)}
              mode="radio"
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ContinueButton
          onPress={() => router.push('/onboarding/timeline')}
          disabled={contentComfort.length === 0}
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
