import { createClient } from '@supabase/supabase-js'
import localStorage from './localStorage'

// These will be replaced with actual credentials when you connect your Supabase project
const SUPABASE_URL = 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

// Use localStorage mock if Supabase credentials are not configured
const isConfigured = !SUPABASE_URL.includes('your-project-id') && !SUPABASE_ANON_KEY.includes('your-anon-key')

let supabase

if (isConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  } catch (error) {
    console.warn('Failed to create Supabase client, using localStorage:', error)
    supabase = localStorage
  }
} else {
  console.warn('Using localStorage instead of Supabase. Please connect your Supabase project.')
  supabase = localStorage
}

export default supabase