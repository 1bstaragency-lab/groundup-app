import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import SelectableCard from '../../components/SelectableCard';
import ContinueButton from '../../components/ContinueButton';
import { Colors, Spacing, FontSize } from '../../constants/theme';

const OPTIONS = [
  'Wasted money',
  'No next step',
  'Algorithm ignores me',
  'Zero feedback',
  'Playlist scams',
  'Posting for nothing',
  'DIY burnout',
  'No connections',
];

export default function FrustrationsScreen() {
  const frustrations = useOnboardingStore((s) => s.frustrations);
  const setFrustrations = useOnboardingStore((s) => s.setFrustrations);

  const toggle = (item: string) => {
    if (frustrations.includes(item)) {
      setFrustrations(frustrations.filter((f) => f !== item));
    } else {
      setFrustrations([...frustrations, item]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What frustrates you most?</Text>
        <Text style={styles.subtitle}>Select all that apply</Text>

        <View style={styles.grid}>
          {OPTIONS.map((option) => (
            <View key={option} style={styles.gridItem}>
              <SelectableCard
                label={option}
                selected={frustrations.includes(option)}
                onPress={() => toggle(option)}
                mode="checkbox"
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ContinueButton
          onPress={() => router.push('/onboarding/wishes')}
          disabled={frustrations.length === 0}
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
