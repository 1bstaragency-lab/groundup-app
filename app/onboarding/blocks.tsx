import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import SelectableCard from '../../components/SelectableCard';
import ContinueButton from '../../components/ContinueButton';
import { Colors, Spacing, FontSize } from '../../constants/theme';

const OPTIONS = [
  'No plan',
  'Content burnout',
  'Not growing',
  'No revenue',
  'Weak visuals',
  'No time',
  'Overwhelmed',
  'All alone',
];

export default function BlocksScreen() {
  const blocks = useOnboardingStore((s) => s.blocks);
  const setBlocks = useOnboardingStore((s) => s.setBlocks);

  const toggle = (item: string) => {
    if (blocks.includes(item)) {
      setBlocks(blocks.filter((b) => b !== item));
    } else {
      setBlocks([...blocks, item]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What's holding you back?</Text>
        <Text style={styles.subtitle}>Select all that apply</Text>

        <View style={styles.grid}>
          {OPTIONS.map((option) => (
            <View key={option} style={styles.gridItem}>
              <SelectableCard
                label={option}
                selected={blocks.includes(option)}
                onPress={() => toggle(option)}
                mode="checkbox"
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ContinueButton
          onPress={() => router.push('/onboarding/frustrations')}
          disabled={blocks.length === 0}
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
