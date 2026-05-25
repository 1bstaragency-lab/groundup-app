import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme'

interface Release {
  id: string
  title: string
  type: string
  release_date: string
  checklist: { label: string; done: boolean }[]
}

interface Task {
  id: string
  content: string
  source: string
}

function StatPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={[st.pill, accent && st.pillAccent]}>
      <Text style={[st.pillVal, accent && st.pillValAccent]}>{value}</Text>
      <Text style={st.pillLabel}>{label}</Text>
    </View>
  )
}

export default function HomeScreen() {
  const { user, signOut } = useAuth()
  const [releases, setReleases] = useState<Release[]>([])
  const [tasks,    setTasks]    = useState<Task[]>([])
  const [loading,  setLoading]  = useState(true)

  const displayName = user?.artistName ?? user?.email?.split('@')[0] ?? 'Artist'

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      supabase.from('releases').select('id,title,type,release_date,checklist').eq('user_id', user.id).order('release_date', { ascending: true }).limit(3),
      supabase.from('up_tasks').select('id,content,source').eq('user_id', user.id).eq('done', false).order('created_at', { ascending: false }).limit(5),
    ]).then(([rRes, tRes]) => {
      setReleases(rRes.data ?? [])
      setTasks(tRes.data ?? [])
      setLoading(false)
    })
  }, [user?.id])

  function daysUntil(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now()
    return Math.ceil(diff / 86400000)
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Good morning,</Text>
            <Text style={s.name}>{displayName.toUpperCase()} 👊</Text>
          </View>
          <TouchableOpacity style={s.planBadge}>
            <Text style={s.planText}>{(user?.planTier ?? 'free').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={s.statsRow}>
          <StatPill label="Plan" value={user?.planTier ?? 'Free'} accent />
          <StatPill label="Releases" value={String(releases.length)} />
          <StatPill label="Tasks" value={String(tasks.length)} />
        </View>

        {/* uP promo card */}
        <TouchableOpacity style={s.upCard} activeOpacity={0.85} onPress={() => router.push('/(tabs)/chat')}>
          <View style={s.upCardLeft}>
            <View style={s.upDot}><Text style={s.upDotText}>uP</Text></View>
            <View>
              <Text style={s.upCardTitle}>Chat with uP</Text>
              <Text style={s.upCardSub}>Your AI music career assistant</Text>
            </View>
          </View>
          <Text style={s.upCardArrow}>→</Text>
        </TouchableOpacity>

        {/* Upcoming releases */}
        <Text style={s.sectionTitle}>UPCOMING RELEASES</Text>
        {loading ? (
          <ActivityIndicator color={Colors.accent} style={{ marginVertical: Spacing.lg }} />
        ) : releases.length === 0 ? (
          <TouchableOpacity style={s.emptyCard} onPress={() => router.push('/(tabs)/releases')}>
            <Text style={s.emptyIcon}>+</Text>
            <Text style={s.emptyText}>Add your first release</Text>
          </TouchableOpacity>
        ) : (
          releases.map(r => {
            const days   = daysUntil(r.release_date)
            const done   = (r.checklist ?? []).filter(t => t.done).length
            const total  = (r.checklist ?? []).length
            const pct    = total > 0 ? done / total : 0
            return (
              <TouchableOpacity key={r.id} style={s.releaseCard} activeOpacity={0.8} onPress={() => router.push('/(tabs)/releases')}>
                <View style={s.releaseTop}>
                  <View>
                    <Text style={s.releaseTitle}>{r.title}</Text>
                    <Text style={s.releaseType}>{r.type.toUpperCase()} · {new Date(r.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                  </View>
                  <View style={[s.daysChip, days <= 7 && s.daysChipUrgent]}>
                    <Text style={[s.daysText, days <= 7 && s.daysTextUrgent]}>
                      {days <= 0 ? 'Today' : `${days}d`}
                    </Text>
                  </View>
                </View>
                <View style={s.progressBg}>
                  <View style={[s.progressFill, { width: `${pct * 100}%` }]} />
                </View>
                <Text style={s.progressLabel}>{done}/{total} tasks done</Text>
              </TouchableOpacity>
            )
          })
        )}

        {/* uP Tasks */}
        {tasks.length > 0 && (
          <>
            <Text style={s.sectionTitle}>UP NEXT FROM uP</Text>
            {tasks.map(t => (
              <View key={t.id} style={s.taskRow}>
                <View style={s.taskDot} />
                <Text style={s.taskText}>{t.content}</Text>
              </View>
            ))}
          </>
        )}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm },

  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xs },
  greeting:  { color: Colors.secondary, fontSize: 13, fontWeight: '600' },
  name:      { color: Colors.white, fontSize: FontSize.xl, fontWeight: '900', letterSpacing: -0.5 },
  planBadge: { backgroundColor: Colors.accentDim, borderWidth: 1, borderColor: 'rgba(245,197,24,0.3)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  planText:  { color: Colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  statsRow: { flexDirection: 'row', gap: Spacing.sm },

  upCard:      { backgroundColor: Colors.card, borderWidth: 1, borderColor: 'rgba(245,197,24,0.2)', borderRadius: Radius.xl, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  upCardLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  upDot:       { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  upDotText:   { color: '#000', fontSize: 11, fontWeight: '900' },
  upCardTitle: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  upCardSub:   { color: Colors.secondary, fontSize: 11, marginTop: 1 },
  upCardArrow: { color: Colors.accent, fontSize: 18, fontWeight: '300' },

  sectionTitle: { color: Colors.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: Spacing.sm },

  emptyCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center', gap: Spacing.xs, borderStyle: 'dashed' },
  emptyIcon: { color: Colors.accent, fontSize: 24, fontWeight: '300' },
  emptyText: { color: Colors.secondary, fontSize: 13 },

  releaseCard:  { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.md, gap: 10 },
  releaseTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  releaseTitle: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  releaseType:  { color: Colors.secondary, fontSize: 11, marginTop: 2, fontWeight: '600' },
  daysChip:     { backgroundColor: '#1A1A1A', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.border },
  daysChipUrgent: { backgroundColor: 'rgba(245,197,24,0.1)', borderColor: 'rgba(245,197,24,0.3)' },
  daysText:     { color: Colors.secondary, fontSize: 11, fontWeight: '700' },
  daysTextUrgent: { color: Colors.accent },
  progressBg:   { height: 4, backgroundColor: '#1E1E1E', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: Colors.accent, borderRadius: 2 },
  progressLabel: { color: Colors.secondary, fontSize: 11 },

  taskRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 4 },
  taskDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent, marginTop: 5, flexShrink: 0 },
  taskText: { color: Colors.secondary, fontSize: 13, flex: 1, lineHeight: 19 },
})

const st = StyleSheet.create({
  pill:         { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.sm, alignItems: 'center', gap: 2 },
  pillAccent:   { borderColor: 'rgba(245,197,24,0.25)', backgroundColor: 'rgba(245,197,24,0.06)' },
  pillVal:      { color: Colors.white, fontSize: FontSize.md, fontWeight: '900' },
  pillValAccent:{ color: Colors.accent },
  pillLabel:    { color: Colors.secondary, fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
})
