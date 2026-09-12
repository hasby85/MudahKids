import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Helper to safely read env vars without throwing ReferenceError in browser
function getEnvVar(key: string): string {
  const metaEnv = (import.meta as any)?.env;
  if (metaEnv && metaEnv[key]) {
    return metaEnv[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
}

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  if (supabaseUrl && supabaseAnonKey) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      return supabaseInstance;
    } catch (e) {
      console.warn("Failed to initialize Supabase client:", e);
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

