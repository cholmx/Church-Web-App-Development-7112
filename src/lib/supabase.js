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
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Test connection and log status
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('announcements_portal123')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    console.log('✅ Supabase connected successfully')
    return true
  } catch (error) {
    console.error('Supabase connection failed:', error)
    return false
  }
}

// Test connection on module load
testConnection()

export default supabase