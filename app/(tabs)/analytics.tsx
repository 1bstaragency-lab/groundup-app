import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme'

type Platform = 'spotify' | 'soundcloud' | 'youtube'

interface Snapshot {
  platform: Platform
  stats:    Record<string, number | string | null>
  fetched_at: string
}

const PLATFORM_META: Record<Platform, { label: string; color: string; bg: string; key: string; unit: string }> = {
  spotify:    { label: 'Spotify',    color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  key: 'monthlyListeners', unit: 'monthly listeners' },
  soundcloud: { label: 'SoundCloud', color: '#fb923c', bg: 'rgba(251,146,60,0.08)',  key: 'followers',        unit: 'followers' },
  youtube:    { label: 'YouTube',    color: '#f87171', bg: 'rgba(248,113,113,0.08)', key: 'subscribers',      unit: 'subscribers' },
}

function fmt(n: number | string | null | undefined): string {
  if (!n) return '—'
  const num = typeof n === 'string' ? parseFloat(n) : n
  if (!Number.isFinite(num)) return '—'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000)
  if (h < 1)  return 'just now'
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

export default function AnalyticsScreen() {
  const { user } = useAuth()
  const [snaps,   setSnaps]   = useState<Snapshot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('platform_snapshots')
      .select('platform, stats, fetched_at')
      .eq('user_id', user.id)
      .order('fetched_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        // Latest per platform
        const latest: Record<string, Snapshot> = {}
        for (const s of (data ?? [])) {
          if (!latest[s.platform]) latest[s.platform] = s as Snapshot
        }
        setSnaps(Object.values(latest))
        setLoading(false)
      })
  }, [user?.id])

  const linkedPlatforms = snaps.map(s => s.platform)
  const unlinked = (['spotify', 'soundcloud', 'youtube'] as Platform[]).filter(p => !linkedPlatforms.includes(p))

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <Text style={s.pageTitle}>Analytics</Text>
        <Text style={s.pageSub}>Platform performance at a glance</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={Colors.accent} style={{ marginTop: 60 }} />
        ) : (
          <>
            {/* Linked platforms */}
            {snaps.map(snap => {
              const meta = PLATFORM_META[snap.platform]
              if (!meta) return null
              const primary = snap.stats[meta.key]
              return (
                <View key={snap.platform} style={[s.card, { borderColor: `${meta.color}22` }]}>
                  <View style={s.cardHeader}>
                    <View style={[s.platformDot, { backgroundColor: meta.bg, borderColor: `${meta.color}33` }]}>
                      <Text style={[s.platformInitial, { color: meta.color }]}>{meta.label[0]}</Text>
                    </View>
                    <View style={s.cardHeaderText}>
                      <Text style={[s.platformLabel, { color: meta.color }]}>{meta.label}</Text>
                      <Text style={s.updatedAt}>Updated {timeAgo(snap.fetched_at)}</Text>
                    </View>
                    <View style={s.linkedBadge}>
                      <Text style={s.linkedText}>✓ Linked</Text>
                    </View>
                  </View>

                  <View style={s.statsRow}>
                    <View style={s.statBlock}>
                      <Text style={[s.statNum, { color: meta.color }]}>{fmt(primary)}</Text>
                      <Text style={s.statLabel}>{meta.unit}</Text>
                    </View>
                    {snap.platform === 'soundcloud' && (
                      <>
                        <View style={s.statDivider} />
                        <View style={s.statBlock}>
                          <Text style={[s.statNum, { color: meta.color }]}>{fmt(snap.stats.plays as number)}</Text>
                          <Text style={s.statLabel}>total plays</Text>
                        </View>
                        <View style={s.statDivider} />
                        <View style={s.statBlock}>
                          <Text style={[s.statNum, { color: meta.color }]}>{fmt(snap.stats.tracks as number)}</Text>
                          <Text style={s.statLabel}>tracks</Text>
                        </View>
                      </>
                    )}
                    {snap.platform === 'youtube' && (
                      <>
                        <View style={s.statDivider} />
                        <View style={s.statBlock}>
                          <Text style={[s.statNum, { color: meta.color }]}>{fmt(snap.stats.videos as number)}</Text>
                          <Text style={s.statLabel}>videos</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              )
            })}

            {/* Unlinked platforms */}
            {unlinked.map(platform => {
              const meta = PLATFORM_META[platform]
              return (
                <View key={platform} style={s.cardEmpty}>
                  <View style={[s.platformDot, { backgroundColor: meta.bg, borderColor: `${meta.color}22` }]}>
                    <Text style={[s.platformInitial, { color: meta.color, opacity: 0.5 }]}>{meta.label[0]}</Text>
                  </View>
                  <View style={s.emptyCardRight}>
                    <Text style={s.emptyCardTitle}>{meta.label} not connected</Text>
                    <Text style={s.emptyCardSub}>Log in at groundupapp.com to link your {meta.label} profile</Text>
                  </View>
                </View>
              )
            })}

            {snaps.length === 0 && unlinked.length === 3 && (
              <View style={s.fullEmpty}>
                <Text style={s.fullEmptyIcon}>▲</Text>
                <Text style={s.fullEmptyTitle}>No platforms connected</Text>
                <Text style={s.fullEmptySub}>Link your Spotify, SoundCloud, or YouTube on the web dashboard to see your stats here.</Text>
              </View>
            )}
          </>
        )}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  topBar:  { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  pageTitle:{ color: Colors.white, fontSize: FontSize.xl, fontWeight: '900', letterSpacing: -0.5 },
  pageSub: { color: Colors.secondary, fontSize: 12, marginTop: 2 },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm },

  card:        { backgroundColor: Colors.card, borderWidth: 1, borderRadius: Radius.xl, padding: Spacing.md, gap: Spacing.md },
  cardHeader:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardHeaderText: { flex: 1, gap: 2 },
  platformDot:    { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  platformInitial:{ fontSize: 16, fontWeight: '900' },
  platformLabel:  { fontSize: 13, fontWeight: '800' },
  updatedAt:      { color: Colors.secondary, fontSize: 11 },
  linkedBadge:    { backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)' },
  linkedText:     { color: Colors.positive, fontSize: 10, fontWeight: '700' },

  statsRow:    { flexDirection: 'row', alignItems: 'center' },
  statBlock:   { flex: 1, alignItems: 'center', gap: 3 },
  statNum:     { fontSize: FontSize.xl, fontWeight: '900', letterSpacing: -0.5 },
  statLabel:   { color: Colors.secondary, fontSize: 11, fontWeight: '600' },
  statDivider: { width: 1, height: 36, backgroundColor: Colors.border },

  cardEmpty:      { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: 0.5 },
  emptyCardRight: { flex: 1, gap: 3 },
  emptyCardTitle: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  emptyCardSub:   { color: Colors.secondary, fontSize: 11, lineHeight: 16 },

  fullEmpty:      { alignItems: 'center', paddingVertical: 80, gap: Spacing.sm },
  fullEmptyIcon:  { color: Colors.accent, fontSize: 32, opacity: 0.4 },
  fullEmptyTitle: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '800', marginTop: Spacing.sm },
  fullEmptySub:   { color: Colors.secondary, fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: Spacing.lg },
})
