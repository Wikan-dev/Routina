import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xxxx.supabase.co"; // isi dari dashboard
const supabaseAnonKey = "public-anon-key";      // isi dari dashboard

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
