import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import SelectableCard from '../../components/SelectableCard';
import ContinueButton from '../../components/ContinueButton';
import { Colors, Spacing, FontSize } from '../../constants/theme';

const STAGES = [
  { label: 'Just Starting', subtitle: "Haven't released yet or just dropped my first track" },
  { label: 'Building', subtitle: 'A few releases out, growing slowly' },
  { label: 'Growing', subtitle: 'Consistent releases, gaining traction' },
  { label: 'Breaking Out', subtitle: 'Real momentum, ready to scale' },
];

export default function StageScreen() {
  const careerStage = useOnboardingStore((s) => s.careerStage);
  const setCareerStage = useOnboardingStore((s) => s.setCareerStage);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Where are you at?</Text>

        <View style={styles.stack}>
          {STAGES.map((stage) => (
            <SelectableCard
              key={stage.label}
              label={stage.label}
              subtitle={stage.subtitle}
              selected={careerStage === stage.label}
              onPress={() => setCareerStage(stage.label)}
              mode="radio"
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ContinueButton
          onPress={() => router.push('/onboarding/goals')}
          disabled={careerStage.length === 0}
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
