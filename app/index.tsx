import { useEffect, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import { Colors, Spacing, FontSize, Radius } from '../constants/theme'

/**
 * Native-app entry screen.
 *
 * Logged-in users  → /(tabs)/home (auto-redirect)
 * New users        → /onboarding/name (Get Started)
 * Returning users  → /(auth)/login   (Sign In)
 *
 * No marketing fluff — this is the first thing Apple reviewers see.
 */
export default function Index() {
  const { user, loading } = useAuth()
  const fadeAnim  = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  // Auto-redirect signed-in users into the app
  useEffect(() => {
    if (loading) return
    if (user) router.replace('/(tabs)/home')
  }, [user, loading])

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start()
  }, [])

  // While auth hydrates or a logged-in user is being redirected, show splash
  if (loading || user) {
    return (
      <View style={s.splash}>
        <View style={s.logoMark}>
          <Text style={s.logoMarkText}>G</Text>
        </View>
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 24 }} />
      </View>
    )
  }

  return (
    <SafeAreaView style={s.safe}>
      <Animated.View
        style={[
          s.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Logo */}
        <View style={s.logoMark}>
          <Text style={s.logoMarkText}>G</Text>
        </View>

        {/* Brand */}
        <View style={s.headingBlock}>
          <Text style={s.brand}>GrounduP</Text>
          <Text style={s.tagline}>The AI assistant for{'\n'}your music career.</Text>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* CTAs */}
        <View style={s.ctaStack}>
          <TouchableOpacity
            style={s.primaryBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/onboarding/name')}
          >
            <Text style={s.primaryBtnText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.secondaryBtn}
            activeOpacity={0.7}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={s.secondaryBtnText}>I already have an account</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.legal}>
          By continuing, you agree to our{' '}
          <Text style={s.legalLink}>Terms</Text> and{' '}
          <Text style={s.legalLink}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  splash: {
    flex:            1,
    backgroundColor: Colors.bg,
    alignItems:      'center',
    justifyContent:  'center',
  },

  container: {
    flex:              1,
    paddingHorizontal: Spacing.xl,
    paddingTop:        Spacing.xl * 2,
    paddingBottom:     Spacing.lg,
    alignItems:        'center',
  },

  logoMark: {
    width:           72,
    height:          72,
    borderRadius:    20,
    backgroundColor: Colors.accent,
    alignItems:      'center',
    justifyContent:  'center',
  },
  logoMarkText: { color: '#000', fontSize: 34, fontWeight: '900' },

  headingBlock: {
    marginTop:  Spacing.lg,
    alignItems: 'center',
    gap:        Spacing.sm,
  },
  brand: {
    color:         Colors.white,
    fontSize:      36,
    fontWeight:    '900',
    letterSpacing: -0.8,
  },
  tagline: {
    color:      Colors.secondary,
    fontSize:   16,
    lineHeight: 23,
    textAlign:  'center',
  },

  ctaStack: {
    width: '100%',
    gap:   Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    height:          56,
    borderRadius:    Radius.lg,
    alignItems:      'center',
    justifyContent:  'center',
  },
  primaryBtnText: {
    color:         '#000',
    fontSize:      FontSize.md,
    fontWeight:    '800',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    height:         52,
    alignItems:     'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color:      Colors.secondary,
    fontSize:   14,
    fontWeight: '600',
  },

  legal: {
    color:      Colors.secondary,
    fontSize:   11,
    textAlign:  'center',
    marginTop:  Spacing.md,
    opacity:    0.6,
    lineHeight: 16,
  },
  legalLink: { color: Colors.accent, opacity: 0.9 },
})
