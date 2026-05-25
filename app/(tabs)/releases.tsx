import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme'

interface CheckItem { label: string; done: boolean }
interface Release {
  id: string; title: string; type: string
  release_date: string; checklist: CheckItem[]
}

export default function ReleasesScreen() {
  const { user } = useAuth()
  const [releases, setReleases] = useState<Release[]>([])
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    supabase.from('releases').select('id,title,type,release_date,checklist').eq('user_id', user.id).order('release_date', { ascending: true })
      .then(({ data }) => { setReleases((data ?? []) as Release[]); setLoading(false) })
  }, [user?.id])

  async function toggleTask(releaseId: string, idx: number) {
    const release = releases.find(r => r.id === releaseId)
    if (!release) return
    const updated = release.checklist.map((t, i) => i === idx ? { ...t, done: !t.done } : t)
    setReleases(prev => prev.map(r => r.id === releaseId ? { ...r, checklist: updated } : r))
    await supabase.from('releases').update({ checklist: updated }).eq('id', releaseId)
  }

  function daysUntil(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <Text style={s.pageTitle}>Releases</Text>
      </View>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={Colors.accent} style={{ marginTop: 60 }} />
        ) : releases.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>◈</Text>
            <Text style={s.emptyTitle}>No releases yet</Text>
            <Text style={s.emptySub}>Text uP in iMessage to plan your first release — it'll appear here automatically.</Text>
          </View>
        ) : (
          releases.map(r => {
            const checklist = r.checklist ?? []
            const done  = checklist.filter(t => t.done).length
            const total = checklist.length
            const pct   = total > 0 ? done / total : 0
            const days  = daysUntil(r.release_date)
            const isExp = expanded === r.id

            return (
              <View key={r.id} style={s.card}>
                <TouchableOpacity onPress={() => setExpanded(isExp ? null : r.id)} activeOpacity={0.8}>
                  <View style={s.cardTop}>
                    <View style={s.cardLeft}>
                      <Text style={s.releaseType}>{r.type.toUpperCase()}</Text>
                      <Text style={s.releaseTitle}>{r.title}</Text>
                      <Text style={s.releaseDate}>{new Date(r.release_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                    </View>
                    <View style={[s.daysChip, days <= 7 && s.daysUrgent]}>
                      <Text style={[s.daysText, days <= 7 && s.daysUrgentText]}>
                        {days <= 0 ? 'OUT NOW' : days === 1 ? 'TOMORROW' : `${days}D`}
                      </Text>
                    </View>
                  </View>

                  {/* Progress bar */}
                  <View style={s.progWrap}>
                    <View style={s.progBg}>
                      <View style={[s.progFill, { width: `${pct * 100}%` }]} />
                    </View>
                    <Text style={s.progText}>{done}/{total} complete</Text>
                  </View>
                </TouchableOpacity>

                {/* Checklist */}
                {isExp && (
                  <View style={s.checklist}>
                    {checklist.map((task, i) => (
                      <TouchableOpacity key={i} style={s.checkRow} onPress={() => toggleTask(r.id, i)} activeOpacity={0.7}>
                        <View style={[s.checkbox, task.done && s.checkboxDone]}>
                          {task.done && <Text style={s.checkmark}>✓</Text>}
                        </View>
                        <Text style={[s.checkLabel, task.done && s.checkLabelDone]}>{task.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )
          })
        )}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  topBar:  { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  pageTitle: { color: Colors.white, fontSize: FontSize.xl, fontWeight: '900', letterSpacing: -0.5 },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm },

  empty:     { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: Spacing.sm },
  emptyIcon: { color: Colors.accent, fontSize: 36, opacity: 0.5 },
  emptyTitle:{ color: Colors.white, fontSize: FontSize.lg, fontWeight: '800', marginTop: Spacing.sm },
  emptySub:  { color: Colors.secondary, fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: Spacing.lg },

  card:        { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.md, gap: 12 },
  cardTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft:    { gap: 3, flex: 1 },
  releaseType: { color: Colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  releaseTitle:{ color: Colors.white, fontSize: 16, fontWeight: '800' },
  releaseDate: { color: Colors.secondary, fontSize: 12 },
  daysChip:    { backgroundColor: '#1A1A1A', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  daysUrgent:  { backgroundColor: 'rgba(245,197,24,0.12)', borderColor: 'rgba(245,197,24,0.3)' },
  daysText:    { color: Colors.secondary, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  daysUrgentText: { color: Colors.accent },

  progWrap:    { gap: 6 },
  progBg:      { height: 4, backgroundColor: '#1E1E1E', borderRadius: 2, overflow: 'hidden' },
  progFill:    { height: 4, backgroundColor: Colors.accent, borderRadius: 2 },
  progText:    { color: Colors.secondary, fontSize: 11 },

  checklist:    { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12, gap: 10 },
  checkRow:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox:     { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  checkmark:    { color: '#000', fontSize: 11, fontWeight: '900' },
  checkLabel:   { color: Colors.white, fontSize: 13, flex: 1, lineHeight: 18 },
  checkLabelDone: { color: Colors.secondary, textDecorationLine: 'line-through' },
})
