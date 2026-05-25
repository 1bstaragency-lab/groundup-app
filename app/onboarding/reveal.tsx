import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme';
import StatCard from '../../components/StatCard';
import TierCard from '../../components/TierCard';
import SlideIndicator from '../../components/SlideIndicator';
import ContinueButton from '../../components/ContinueButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_PADDING = Spacing.lg;

// ---------------------------------------------------------------------------
// Tier definitions
// ---------------------------------------------------------------------------

interface TierDef {
  name: string;
  price: string;
  subtitle: string;
  color: string;
  features: string[];
}

const TIERS: TierDef[] = [
  {
    name: 'Foundation',
    price: '$15/mo',
    subtitle: '3-day free trial, then $9.99/wk',
    color: Colors.foundation,
    features: [
      'Basic release guidance',
      'Content calendar help',
      '3 content ideas/mo',
      '1 cover art or 4K visualizer',
      'All resources (some restricted)',
      'No check-ins',
    ],
  },
  {
    name: 'Growth',
    price: '$30/mo',
    subtitle: 'Most popular for building artists',
    color: Colors.growth,
    features: [
      'Everything in Foundation',
      '6 content ideas/mo',
      'Rollout support',
      '2 promo/visual assets',
      '2 check-ins per month',
      'Some PR restricted',
    ],
  },
  {
    name: 'Breakout',
    price: '$50/mo',
    subtitle: 'For artists gaining real traction',
    color: Colors.breakout,
    features: [
      'Everything in Growth',
      '10 content ideas/mo',
      'Stronger brand direction',
      '3-4 visual assets',
      'Weekly check-ins',
      'Full resource access',
    ],
  },
  {
    name: 'Plant',
    price: '$500/mo',
    subtitle: 'Full white-glove service',
    color: Colors.plant,
    features: [
      'Full strategy + daily check-ins',
      'Dedicated assistant',
      'Automated systems',
      'Visualizers + lyric videos',
      'Influencer + PR support',
      'Clipping campaigns',
      'Everything unlocked',
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CONTENT_SUBTITLE: Record<string, string> = {
  'I hate it': "We'll handle the heavy lifting for you.",
  'I struggle': "We'll make it feel natural.",
  "It's okay": "Let's sharpen your direction.",
  'I love it': "Here's your strategy toolkit.",
};

const STAGE_SUBTITLE: Record<string, string> = {
  'Just Starting': 'Your launchpad is ready.',
  Building: 'Time to accelerate.',
  Growing: "Let's push harder.",
  'Breaking Out': 'Scale mode activated.',
};

const TIER_COLOR: Record<string, string> = {
  Foundation: Colors.foundation,
  Growth: Colors.growth,
  Breakout: Colors.breakout,
  Plant: Colors.plant,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RevealScreen() {
  const store = useOnboardingStore();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const recommendedTier = store.getRecommendedTier();
  const [selectedTier, setSelectedTier] = useState(recommendedTier);
  const [expandedTier, setExpandedTier] = useState(recommendedTier);

  // Persist selection to store whenever it changes
  const handleSelectTier = useCallback(
    (tierName: string) => {
      setSelectedTier(tierName);
      setExpandedTier(tierName);
      store.setSelectedTier(tierName);
    },
    [store],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    },
    [currentIndex],
  );

  const scrollToSlide = useCallback(
    (index: number) => {
      scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    },
    [],
  );

  // ------- Button logic -------
  const getButtonLabel = (): string => {
    if (currentIndex < 4) return 'Next \u2192';
    if (selectedTier === 'Foundation') return 'Start Free Trial \u2192';
    return `Start with ${selectedTier} \u2192`;
  };

  const handleContinue = () => {
    if (currentIndex < 4) {
      scrollToSlide(currentIndex + 1);
    } else {
      store.setSelectedTier(selectedTier);
      router.push('/onboarding/checkout' as any);
    }
  };

  // ------- Slide renderers -------

  const renderAnalyticsSlide = () => {
    const { platforms } = store;

    const platformCards: { label: string; value: number; delta: number }[] = [];

    if (platforms.includes('Spotify'))
      platformCards.push({ label: 'Monthly Listeners', value: 12847, delta: 12.3 });
    if (platforms.includes('Apple Music'))
      platformCards.push({ label: 'Apple Music Plays', value: 8421, delta: 8.7 });
    if (platforms.includes('TikTok'))
      platformCards.push({ label: 'TikTok Views', value: 45200, delta: 24.1 });
    if (platforms.includes('Instagram'))
      platformCards.push({ label: 'Instagram Reach', value: 18900, delta: 15.2 });
    if (platforms.includes('YouTube'))
      platformCards.push({ label: 'YouTube Views', value: 6340, delta: 5.8 });
    if (platforms.includes('SoundCloud'))
      platformCards.push({ label: 'SoundCloud Plays', value: 3210, delta: 9.4 });

    platformCards.push({ label: 'Total Followers', value: 4832, delta: 18.5 });

    return (
      <ScrollView style={styles.slideScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>YOUR ANALYTICS HUB</Text>
        </View>
        <View style={styles.cardGrid}>
          {platformCards.map((card) => (
            <View key={card.label} style={styles.gridItem}>
              <StatCard label={card.label} value={card.value} delta={card.delta} />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderContentSlide = () => {
    const subtitle =
      CONTENT_SUBTITLE[store.contentComfort] || "Let's sharpen your direction.";

    const tools = [
      { emoji: '\uD83D\uDCC5', title: 'Smart Content Calendar', desc: 'Plan and schedule with ease' },
      { emoji: '\uD83C\uDFAC', title: 'Visualizer Creator', desc: 'Motion content for every drop' },
      { emoji: '\uD83D\uDCE6', title: 'Batch Planner', desc: 'Create weeks of content in one session' },
      { emoji: '\uD83C\uDFAF', title: 'Reference-Based Direction', desc: 'Mood boards and visual strategy' },
    ];

    return (
      <ScrollView style={styles.slideScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>CONTENT & CREATIVE</Text>
        </View>
        <Text style={styles.slideSubtitle}>{subtitle}</Text>
        <View style={styles.cardGrid}>
          {tools.map((tool) => (
            <View key={tool.title} style={styles.gridItem}>
              <View style={styles.toolCard}>
                <Text style={styles.toolEmoji}>{tool.emoji}</Text>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDesc}>{tool.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderGrowthSlide = () => {
    const subtitle =
      STAGE_SUBTITLE[store.careerStage] || 'Time to accelerate.';

    const bars = [
      { label: 'Followers', pct: 67 },
      { label: 'Streams', pct: 45 },
      { label: 'Content Output', pct: 82 },
      { label: 'Revenue', pct: 34 },
    ];

    return (
      <ScrollView style={styles.slideScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>GROWTH ENGINE</Text>
        </View>
        <Text style={styles.slideSubtitle}>{subtitle}</Text>
        <View style={{ gap: 20, marginTop: Spacing.md }}>
          {bars.map((bar) => (
            <View key={bar.label}>
              <View style={styles.barLabelRow}>
                <Text style={styles.barLabel}>{bar.label}</Text>
                <Text style={styles.barPct}>+{bar.pct}% projected 90-day growth</Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${bar.pct}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderResourceSlide = () => {
    const { wishes } = store;
    const displayed = wishes.slice(0, 3);
    const wishText =
      displayed.length >= 2
        ? `Because you wanted ${displayed.slice(0, -1).join(', ')} and ${displayed[displayed.length - 1]}.`
        : displayed.length === 1
          ? `Because you wanted ${displayed[0]}.`
          : 'Curated resources just for you.';

    const rows: {
      tag: string;
      tagBg: string;
      tagColor: string;
      title: string;
      desc: string;
      highlighted?: boolean;
    }[] = [
      {
        tag: 'CURATED',
        tagBg: '#F5C518',
        tagColor: '#000000',
        title: 'Curated YouTube Playlists',
        desc: 'Hand-picked playlists that match your genre and audience.',
      },
      {
        tag: 'IN-HOUSE',
        tagBg: '#22C55E',
        tagColor: '#000000',
        title: 'In-House Playlist Submissions',
        desc: 'Direct submission pipeline to growing independent playlists.',
      },
      {
        tag: 'PR',
        tagBg: '#8B5CF6',
        tagColor: '#FFFFFF',
        title: 'PR Outlet Submissions',
        desc: 'Get your music featured on blogs and media outlets.',
      },
      {
        tag: 'EDITORIAL',
        tagBg: '#3B82F6',
        tagColor: '#FFFFFF',
        title: 'Spotify Editorial Pitching',
        desc: 'Optimized pitches for official Spotify editorial playlists.',
      },
      {
        tag: 'PAY-PER-METRIC',
        tagBg: '#EF4444',
        tagColor: '#FFFFFF',
        title: 'TikTok Influencer & Clipping Campaigns',
        desc: 'Performance-based campaigns with vetted creators.',
        highlighted: true,
      },
    ];

    return (
      <ScrollView style={styles.slideScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>THE RESOURCE BIBLE</Text>
        </View>
        <Text style={styles.slideSubtitle}>{wishText}</Text>
        {rows.map((row) => (
          <View
            key={row.tag}
            style={[
              styles.resourceRow,
              row.highlighted && { borderColor: '#EF4444', borderWidth: 1 },
            ]}
          >
            <View style={[styles.resourceTag, { backgroundColor: row.tagBg }]}>
              <Text style={[styles.resourceTagText, { color: row.tagColor }]}>
                {row.tag}
              </Text>
            </View>
            <Text style={styles.resourceTitle}>{row.title}</Text>
            <Text style={styles.resourceDesc}>{row.desc}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderTierSlide = () => {
    const tierColor = TIER_COLOR[recommendedTier] || Colors.accent;

    return (
      <ScrollView style={styles.slideScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>YOUR RECOMMENDED PLAN</Text>
        </View>
        <Text style={styles.tierHeadline}>
          We'd start you on{' '}
          <Text style={{ color: tierColor }}>{recommendedTier}</Text>
        </Text>
        <Text style={styles.tierSubtext}>You can change this anytime.</Text>
        <View style={{ gap: 12, marginTop: Spacing.md }}>
          {TIERS.map((tier) => (
            <TierCard
              key={tier.name}
              name={tier.name === 'Plant' ? `\uD83C\uDF31 ${tier.name}` : tier.name}
              price={tier.price}
              subtitle={tier.subtitle}
              color={tier.color}
              features={tier.features}
              recommended={tier.name === recommendedTier}
              expanded={expandedTier === tier.name}
              selected={selectedTier === tier.name}
              onPress={() => handleSelectTier(tier.name)}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

  // ------- Render -------

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        <View style={styles.slide}>{renderAnalyticsSlide()}</View>
        <View style={styles.slide}>{renderContentSlide()}</View>
        <View style={styles.slide}>{renderGrowthSlide()}</View>
        <View style={styles.slide}>{renderResourceSlide()}</View>
        <View style={styles.slide}>{renderTierSlide()}</View>
      </ScrollView>

      <View style={styles.footer}>
        <SlideIndicator count={5} active={currentIndex} />
        <View style={styles.buttonWrapper}>
          <ContinueButton label={getButtonLabel()} onPress={handleContinue} />
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  pager: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: SLIDE_PADDING,
  },
  slideScroll: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  footer: {
    paddingHorizontal: SLIDE_PADDING,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  buttonWrapper: {
    paddingBottom: 0, // ContinueButton handles safe-area bottom
  },

  // ----- Pill tag -----
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: Spacing.md,
  },
  pillText: {
    color: '#000000',
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ----- Card grid (2 col) -----
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%' as any,
    flexGrow: 1,
    flexBasis: '46%',
  },

  // ----- Slide subtitle -----
  slideSubtitle: {
    color: Colors.secondary,
    fontSize: FontSize.md,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },

  // ----- Tool cards (slide 2) -----
  toolCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  toolEmoji: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  toolTitle: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: 4,
  },
  toolDesc: {
    color: Colors.secondary,
    fontSize: FontSize.xs,
    lineHeight: 18,
  },

  // ----- Growth bars (slide 3) -----
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  barLabel: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  barPct: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  barTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  barFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },

  // ----- Resource rows (slide 4) -----
  resourceRow: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 12,
  },
  resourceTag: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: Spacing.sm,
  },
  resourceTagText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resourceTitle: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: 4,
  },
  resourceDesc: {
    color: Colors.secondary,
    fontSize: FontSize.xs,
    lineHeight: 18,
  },

  // ----- Tier slide (slide 5) -----
  tierHeadline: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  tierSubtext: {
    color: Colors.secondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
});
