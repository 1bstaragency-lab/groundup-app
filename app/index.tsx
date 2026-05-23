import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';

const { width: W } = Dimensions.get('window');

// Mock iMessage conversation demonstrating uP in action
const MESSAGES = [
  {
    from: 'up',
    text: '"Drank In My Cup" drops in 3 days. Still need to pitch 2 DJs. Want me to find them?',
  },
  { from: 'user', text: 'Yes — who should I hit?' },
  {
    from: 'up',
    text: 'DJ Smoov (92K) and DJ Kris (45K) — both active in your lane. I can draft the pitch right now.',
  },
];

const CHIPS = ['💬 iMessage AI', '🎵 Release Planning', '🎯 Curator Matching'];

function MockConversation() {
  return (
    <View style={conv.wrapper}>
      {/* Header bar */}
      <View style={conv.header}>
        <View style={conv.avatar}>
          <Text style={conv.avatarText}>uP</Text>
        </View>
        <View>
          <Text style={conv.headerName}>uP</Text>
          <Text style={conv.headerSub}>GrounduP AI · Active now</Text>
        </View>
      </View>

      {/* Messages */}
      <View style={conv.messages}>
        {MESSAGES.map((m, i) => (
          <View
            key={i}
            style={[conv.row, m.from === 'user' ? conv.rowRight : conv.rowLeft]}
          >
            <View
              style={[
                conv.bubble,
                m.from === 'up' ? conv.bubbleUp : conv.bubbleUser,
              ]}
            >
              <Text
                style={[
                  conv.bubbleText,
                  m.from === 'up' ? conv.textUp : conv.textUser,
                ]}
              >
                {m.text}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const conv = StyleSheet.create({
  wrapper: {
    backgroundColor: '#111111',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    width: W - Spacing.lg * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#0D0D0D',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  headerSub: {
    color: Colors.secondary,
    fontSize: 11,
    lineHeight: 14,
  },
  messages: {
    padding: Spacing.md,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  bubbleUp: {
    backgroundColor: 'rgba(245,197,24,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.2)',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  textUp: {
    color: Colors.white,
  },
  textUser: {
    color: Colors.secondary,
  },
});

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Eyebrow */}
        <View style={styles.eyebrow}>
          <Text style={styles.eyebrowText}>GrounduP Artist OS</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>Your career,{'\n'}in your messages.</Text>
        <Text style={styles.subheadline}>
          uP is your personal music career AI — strategy, releases, and
          curator connections, all through iMessage.
        </Text>

        {/* Mock conversation */}
        <MockConversation />

        {/* Feature chips */}
        <View style={styles.chips}>
          {CHIPS.map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.ctaButton}
          onPress={() => router.push('/onboarding/name')}
        >
          <Text style={styles.ctaText}>Get started — it's free</Text>
        </TouchableOpacity>

        <Text style={styles.subtext}>Takes under 2 minutes to set up</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  eyebrow: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentDim,
    borderWidth: 1,
    borderColor: 'rgba(245,197,24,0.25)',
  },
  eyebrowText: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headline: {
    color: Colors.white,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  subheadline: {
    color: Colors.secondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: Spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: Spacing.sm,
  },
  ctaText: {
    color: '#000000',
    fontSize: FontSize.md,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtext: {
    color: Colors.secondary,
    fontSize: 12,
    marginTop: -Spacing.sm,
  },
});
