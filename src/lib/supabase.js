import { createClient } from '@supabase/supabase-js'

// These will be replaced with actual credentials when you connect your Supabase project
const SUPABASE_URL = 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

// For now, we'll use a mock that falls back to localStorage
const createMockSupabase = () => {
  console.warn('Using localStorage instead of Supabase. Please connect your Supabase project.');
  
  return {
    from: (table) => ({
      select: () => ({
        order: () => ({
          then: (callback) => {
            const data = JSON.parse(localStorage.getItem(table) || '[]');
            callback({ data, error: null });
          }
        }),
        then: (callback) => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          callback({ data, error: null });
        }
      }),
      insert: (records) => {
        const existing = JSON.parse(localStorage.getItem(table) || '[]');
        const newRecords = records.map(record => ({
          ...record,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString()
        }));
        existing.push(...newRecords);
        localStorage.setItem(table, JSON.stringify(existing));
        return Promise.resolve({ data: newRecords, error: null });
      },
      update: (updates) => ({
        eq: (column, value) => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const updated = data.map(item => 
            item[column] === value ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
          );
          localStorage.setItem(table, JSON.stringify(updated));
          return Promise.resolve({ data: updated, error: null });
        }
      }),
      delete: () => ({
        eq: (column, value) => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const filtered = data.filter(item => item[column] !== value);
          localStorage.setItem(table, JSON.stringify(filtered));
          return Promise.resolve({ data: filtered, error: null });
        }
      })
    })
  };
};

// Try to create real Supabase client, fall back to mock
let supabase;
try {
  if (SUPABASE_URL.includes('your-project-id') || SUPABASE_ANON_KEY.includes('your-anon-key')) {
    supabase = createMockSupabase();
  } else {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }
} catch (error) {
  console.warn('Failed to create Supabase client, using localStorage:', error);
  supabase = createMockSupabase();
}

export default supabase;