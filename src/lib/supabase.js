import { createClient } from '@supabase/supabase-js'

// Your Supabase project credentials
const SUPABASE_URL = 'https://ujotluggpkxvgsyhdviv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqb3RsdWdncGt4dmdzeWhkdml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MTc4ODIsImV4cCI6MjA2Njk5Mzg4Mn0.q9zIpG91s_2hdioT58x7rCoRNoWTUvJKS_oE5AauMB8'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase