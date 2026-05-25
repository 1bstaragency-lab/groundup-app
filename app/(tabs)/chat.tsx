import { useState, useRef, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme'

interface Message {
  id:      string
  role:    'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  'Plan my next release',
  'Pitch to Spotify curators',
  'Build a Meta ad strategy',
  'What should I post today?',
]

export default function ChatScreen() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)
  const flatRef = useRef<FlatList>(null)

  // Load conversation history
  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('up_conversations')
      .select('id, role, content')
      .eq('user_id', user.id)
      .eq('channel', 'imessage')
      .order('created_at', { ascending: true })
      .limit(30)
      .then(({ data }) => {
        setMessages((data ?? []) as Message[])
        setFetching(false)
      })
  }, [user?.id])

  async function send(text: string) {
    if (!text.trim() || loading || !user?.id) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Log user message
    await supabase.from('up_conversations').insert({
      user_id: user.id, role: 'user', content: userMsg.content, channel: 'imessage',
    })

    try {
      const res = await fetch('https://groundupapp.com/.netlify/functions/up-chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, message: userMsg.content }),
      })
      const data = await res.json()
      const reply = data.reply ?? "I'm on it — let me get back to you on that."
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: reply }
      setMessages(prev => [...prev, assistantMsg])
      await supabase.from('up_conversations').insert({
        user_id: user.id, role: 'assistant', content: reply, channel: 'imessage',
      })
    } catch {
      const err: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: "Couldn't reach uP — check your connection and try again." }
      setMessages(prev => [...prev, err])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100)
    }
  }, [messages])

  function renderMessage({ item }: { item: Message }) {
    const isUser = item.role === 'user'
    return (
      <View style={[m.row, isUser ? m.rowRight : m.rowLeft]}>
        {!isUser && (
          <View style={m.avatar}><Text style={m.avatarText}>uP</Text></View>
        )}
        <View style={[m.bubble, isUser ? m.bubbleUser : m.bubbleUp]}>
          <Text style={[m.text, isUser ? m.textUser : m.textUp]}>{item.content}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.headerAvatar}><Text style={s.headerAvatarText}>uP</Text></View>
          <View>
            <Text style={s.headerName}>uP · GrounduP AI</Text>
            <Text style={s.headerSub}>Your music career assistant</Text>
          </View>
        </View>
        <View style={s.onlineDot} />
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {fetching ? (
          <View style={s.center}><ActivityIndicator color={Colors.accent} /></View>
        ) : (
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={s.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={s.emptyWrap}>
                <Text style={s.emptyTitle}>Start a conversation</Text>
                <Text style={s.emptySub}>Ask uP anything about your music career.</Text>
                <View style={s.prompts}>
                  {QUICK_PROMPTS.map(p => (
                    <TouchableOpacity key={p} style={s.prompt} onPress={() => send(p)}>
                      <Text style={s.promptText}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            }
          />
        )}

        {/* Input bar */}
        <View style={s.bar}>
          <TextInput
            style={s.input}
            placeholder="Message uP…"
            placeholderTextColor={Colors.secondary}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => send(input)}
          />
          <TouchableOpacity
            style={[s.sendBtn, (!input.trim() || loading) && s.sendDisabled]}
            onPress={() => send(input)}
            disabled={!input.trim() || loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="#000" size="small" />
              : <Text style={s.sendIcon}>↑</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  flex:   { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list:   { padding: Spacing.md, gap: 10, flexGrow: 1 },

  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: '#0D0D0D' },
  headerLeft:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar:     { width: 38, height: 38, borderRadius: 11, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  headerAvatarText: { color: '#000', fontSize: 12, fontWeight: '900' },
  headerName:       { color: Colors.white, fontSize: 14, fontWeight: '700' },
  headerSub:        { color: Colors.secondary, fontSize: 11, marginTop: 1 },
  onlineDot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.positive },

  emptyWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: Spacing.sm },
  emptyTitle: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '800' },
  emptySub:   { color: Colors.secondary, fontSize: 13, textAlign: 'center', paddingHorizontal: Spacing.xl },
  prompts:    { gap: 8, width: '100%', paddingHorizontal: Spacing.md, marginTop: Spacing.sm },
  prompt:     { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: 12, alignItems: 'center' },
  promptText: { color: Colors.secondary, fontSize: 13, fontWeight: '600' },

  bar:         { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: Spacing.sm, paddingHorizontal: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: '#0D0D0D', paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.sm },
  input:       { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, paddingHorizontal: 14, paddingVertical: 10, color: Colors.white, fontSize: 14, maxHeight: 100 },
  sendBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  sendDisabled:{ opacity: 0.35 },
  sendIcon:    { color: '#000', fontSize: 18, fontWeight: '700', marginTop: -2 },
})

const m = StyleSheet.create({
  row:          { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  rowLeft:      { justifyContent: 'flex-start' },
  rowRight:     { justifyContent: 'flex-end' },
  avatar:       { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText:   { color: '#000', fontSize: 9, fontWeight: '900' },
  bubble:       { maxWidth: '78%', borderRadius: 18, paddingHorizontal: 13, paddingVertical: 9 },
  bubbleUp:     { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderBottomLeftRadius: 4 },
  bubbleUser:   { backgroundColor: Colors.accent, borderBottomRightRadius: 4 },
  text:         { fontSize: 14, lineHeight: 20 },
  textUp:       { color: Colors.white },
  textUser:     { color: '#000', fontWeight: '600' },
})
