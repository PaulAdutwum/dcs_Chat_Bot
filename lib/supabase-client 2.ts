import { v4 as uuidv4 } from 'uuid';
import { Database } from '@/types/supabase';

// In-memory fallback storage
const localUserProfiles: Record<string, any> = {};

// Mock implementation for environments without Supabase
const createMockClient = () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: null, error: 'Not implemented in mock client' }),
      signIn: async () => ({ data: null, error: 'Not implemented in mock client' }),
      signOut: async () => ({ error: null })
    },
    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            if (table === 'user_profiles' && column === 'user_id') {
              return { data: localUserProfiles[value] || null, error: null };
            }
            return { data: null, error: null };
          },
          limit: (limit: number) => ({
            data: [],
            error: null
          })
        }),
        limit: (limit: number) => ({
          data: [],
          error: null
        })
      }),
      insert: (row: any) => ({
        select: (columns: string = '*') => ({
          single: async () => {
            if (table === 'user_profiles') {
              const id = row.user_id || uuidv4();
              localUserProfiles[id] = { ...row, id };
              return { data: localUserProfiles[id], error: null };
            }
            return { data: null, error: null };
          }
        })
      }),
      update: (updates: any) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            if (table === 'user_profiles' && column === 'user_id' && localUserProfiles[value]) {
              localUserProfiles[value] = { ...localUserProfiles[value], ...updates };
              return { data: localUserProfiles[value], error: null };
            }
            return { data: null, error: 'Not found' };
          }
        })
      })
    })
  };
};

// Attempt to initialize the Supabase client if available
const initSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return createMockClient();
  }

  try {
    // Check if environment variables exist
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Missing Supabase credentials. Using mock client.');
      return createMockClient();
    }

    // Dynamically import Supabase client
    const { createClient } = require('@supabase/supabase-js');
    const client = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
    return client;
  } catch (error) {
    console.warn('Error initializing Supabase client. Using mock client:', error);
    return createMockClient();
  }
};

// Export a client instance that's either the real Supabase client or a mock
export const supabase = initSupabaseClient();

// Helper function to get or create a user ID
export const getUserId = async (): Promise<string> => {
  // Check for authenticated user first
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user.id;
  } catch (error) {
    console.warn('Error getting authenticated user:', error);
  }
  
  // For anonymous users, use a UUID stored in localStorage
  if (typeof window !== 'undefined') {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
      anonymousId = uuidv4();
      localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
  }
  
  // Fallback for server-side
  return uuidv4();
};

// Helper function to check database connection
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
    return false;
  }
}; 