import { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme'

const PLAN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  free:   { bg: 'rgba(255,255,255,0.05)', text: Colors.secondary, border: Colors.border },
  pro:    { bg: 'rgba(59,130,246,0.1)',   text: '#60a5fa',       border: 'rgba(59,130,246,0.2)' },
  growth: { bg: 'rgba(245,197,24,0.1)',   text: Colors.accent,   border: 'rgba(245,197,24,0.25)' },
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={r.row}>
      <Text style={r.label}>{label}</Text>
      <Text style={[r.value, accent && r.valueAccent]}>{value}</Text>
    </View>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={p.section}>
      <Text style={p.sectionTitle}>{title}</Text>
      <View style={p.sectionCard}>{children}</View>
    </View>
  )
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const planMeta = PLAN_COLORS[user?.planTier ?? 'free'] ?? PLAN_COLORS.free
  const initials = (user?.artistName ?? user?.email ?? 'A').slice(0, 2).toUpperCase()

  async function handleSignOut() {
    Alert.alert('Sign out?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          setLoggingOut(true)
          await signOut()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  return (
    <SafeAreaView style={p.safe}>
      <ScrollView style={p.scroll} contentContainerStyle={p.content} showsVerticalScrollIndicator={false}>

        {/* Avatar + name */}
        <View style={p.avatarRow}>
          <View style={p.avatar}>
            <Text style={p.avatarText}>{initials}</Text>
          </View>
          <View style={p.nameBlock}>
            <Text style={p.displayName}>{user?.artistName ?? 'Artist'}</Text>
            <Text style={p.email}>{user?.email}</Text>
          </View>
          <View style={[p.planBadge, { backgroundColor: planMeta.bg, borderColor: planMeta.border }]}>
            <Text style={[p.planText, { color: planMeta.text }]}>{(user?.planTier ?? 'FREE').toUpperCase()}</Text>
          </View>
        </View>

        {/* Account */}
        <Section title="ACCOUNT">
          <Row label="Email"       value={user?.email ?? '—'} />
          <View style={p.divider} />
          <Row label="Plan"        value={user?.planTier ?? 'Free'} accent />
          <View style={p.divider} />
          <Row label="User ID"     value={(user?.id ?? '').slice(0, 8) + '…'} />
        </Section>

        {/* uP iMessage */}
        <Section title="uP iMessage">
          <View style={p.upRow}>
            <View style={p.upDot}><Text style={p.upDotText}>uP</Text></View>
            <View style={p.upInfo}>
              <Text style={p.upTitle}>uP is your AI assistant</Text>
              <Text style={p.upSub}>Text +1 (310) 919-9037 to chat via iMessage</Text>
            </View>
          </View>
        </Section>

        {/* Upgrade */}
        {(user?.planTier === 'free' || !user?.planTier) && (
          <Section title="UPGRADE">
            <View style={p.upgradeCard}>
              <Text style={p.upgradeTitle}>Unlock Pro</Text>
              <Text style={p.upgradeSub}>100 messages/day · Spotify pitching · Meta ad builder · Full release calendar</Text>
              <TouchableOpacity style={p.upgradeBtn}>
                <Text style={p.upgradeBtnText}>Start 7-Day Free Trial →</Text>
              </TouchableOpacity>
            </View>
          </Section>
        )}

        {/* Actions */}
        <View style={p.actions}>
          <TouchableOpacity
            style={[p.actionBtn, p.signOutBtn]}
            onPress={handleSignOut}
            disabled={loggingOut}
            activeOpacity={0.8}
          >
            <Text style={p.signOutText}>{loggingOut ? 'Signing out…' : 'Sign Out'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={p.version}>GrounduP v1.0 · groundupapp.com</Text>
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const p = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: Colors.bg },
  scroll:   { flex: 1 },
  content:  { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.lg },

  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar:    { width: 56, height: 56, borderRadius: 16, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText:{ color: '#000', fontSize: 20, fontWeight: '900' },
  nameBlock: { flex: 1, gap: 2 },
  displayName:{ color: Colors.white, fontSize: FontSize.lg, fontWeight: '900', letterSpacing: -0.3 },
  email:     { color: Colors.secondary, fontSize: 12 },
  planBadge: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  planText:  { fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  section:     { gap: 8 },
  sectionTitle:{ color: Colors.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  sectionCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, paddingHorizontal: Spacing.md, paddingVertical: 4 },
  divider:     { height: 1, backgroundColor: Colors.border },

  upRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: Spacing.sm },
  upDot:   { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  upDotText:{ color: '#000', fontSize: 11, fontWeight: '900' },
  upInfo:  { flex: 1, gap: 2 },
  upTitle: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  upSub:   { color: Colors.secondary, fontSize: 11, lineHeight: 16 },

  upgradeCard: { padding: Spacing.md, gap: Spacing.sm },
  upgradeTitle:{ color: Colors.accent, fontSize: FontSize.lg, fontWeight: '900' },
  upgradeSub:  { color: Colors.secondary, fontSize: 12, lineHeight: 18 },
  upgradeBtn:  { backgroundColor: Colors.accent, borderRadius: Radius.lg, height: 46, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  upgradeBtnText: { color: '#000', fontSize: 13, fontWeight: '800' },

  actions:    { gap: Spacing.sm },
  actionBtn:  { height: 50, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  signOutBtn: { borderColor: '#EF444433', backgroundColor: 'rgba(239,68,68,0.05)' },
  signOutText:{ color: '#EF4444', fontSize: 14, fontWeight: '700' },

  version: { color: Colors.secondary, fontSize: 11, textAlign: 'center', opacity: 0.5 },
})

const r = StyleSheet.create({
  row:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  label:      { color: Colors.secondary, fontSize: 13 },
  value:      { color: Colors.white, fontSize: 13, fontWeight: '600' },
  valueAccent:{ color: Colors.accent },
})
