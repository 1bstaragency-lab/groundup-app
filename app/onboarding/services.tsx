import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

interface ServiceCardData {
  emoji: string;
  title: string;
  description: string;
}

const SERVICES: ServiceCardData[] = [
  {
    emoji: '\uD83D\uDE80',
    title: 'Release Rollout Engine',
    description:
      'Structured timelines, task checklists, and milestone tracking for every drop.',
  },
  {
    emoji: '\uD83C\uDFA8',
    title: 'Creative Studio',
    description:
      'Visualizers, cover art, lyric videos, and editorial photo direction.',
  },
  {
    emoji: '\uD83D\uDCC5',
    title: 'Content System',
    description:
      'Calendar, queue, batch planning, and automation \u2014 tailored to your comfort level.',
  },
  {
    emoji: '\uD83D\uDCCA',
    title: 'Analytics Dashboard',
    description:
      'Streams, followers, growth trends, and content performance in one view.',
  },
  {
    emoji: '\uD83C\uDFB5',
    title: 'Vetted Playlist Network',
    description:
      'In-house curators, no middlemen, no scams. Real placements from real people.',
  },
  {
    emoji: '\uD83D\uDCF0',
    title: 'PR & Press Pipeline',
    description:
      'Blog submissions, press kits, and Spotify editorial pitch templates.',
  },
];

function buildSummary(
  blocks: string[],
  frustrations: string[],
  wishes: string[],
): string {
  const all = [...blocks, ...frustrations, ...wishes];
  const unique = Array.from(new Set(all));
  const picks = unique.slice(0, 5);

  if (picks.length === 0) return 'your challenges';
  if (picks.length === 1) return picks[0];
  if (picks.length === 2) return `${picks[0]} and ${picks[1]}`;

  const last = picks[picks.length - 1];
  const rest = picks.slice(0, -1).join(', ');
  return `${rest}, and ${last}`;
}

export default function ServicesScreen() {
  const blocks = useOnboardingStore((s) => s.blocks);
  const frustrations = useOnboardingStore((s) => s.frustrations);
  const wishes = useOnboardingStore((s) => s.wishes);

  const summary = useMemo(
    () => buildSummary(blocks, frustrations, wishes),
    [blocks, frustrations, wishes],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pillContainer}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>WE HEAR YOU</Text>
          </View>
        </View>

        <Text style={styles.headline}>You said: {summary}.</Text>

        <Text style={styles.body}>
          That's exactly what grounduP was built for. Here's what you're getting
          access to:
        </Text>

        <View style={styles.grid}>
          {SERVICES.map((service) => (
            <View key={service.title} style={styles.gridItem}>
              <View style={styles.serviceCard}>
                <Text style={styles.emoji}>{service.emoji}</Text>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDesc}>{service.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.ctaButton}
          onPress={() => router.push('/onboarding/name')}
        >
          <Text style={styles.ctaText}>Now let's get specific \u2192</Text>
        </TouchableOpacity>
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
  pillContainer: {
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  pill: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pillText: {
    color: '#000000',
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headline: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    lineHeight: 30,
  },
  body: {
    color: Colors.secondary,
    fontSize: FontSize.md,
    lineHeight: 24,
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
  serviceCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  emoji: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  serviceTitle: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  serviceDesc: {
    color: Colors.secondary,
    fontSize: 13,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ctaText: {
    color: '#000000',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
