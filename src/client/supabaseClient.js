import { createClient } from "@supabase/supabase-js";

// Supabase configuration dari environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qanrkuwjetvetnzncdin.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error("VITE_SUPABASE_ANON_KEY is not set in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || "");
