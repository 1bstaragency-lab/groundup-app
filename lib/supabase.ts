import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Same Supabase project as the web app
const SUPABASE_URL  = 'https://grcokomtylgzjpakezed.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyY29rb210eWxnemppYWtlemVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMzI4NzMsImV4cCI6MjA2MTgwODg3M30.vVAe74y0KomYE1YGBR_j4TiFSSJxSAqI4dtrXblW6kM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage:          AsyncStorage,
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: false,
  },
})
