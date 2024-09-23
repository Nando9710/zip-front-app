import { environment } from "@env";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_CONFIG: SupabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabaseSecretKey,
  {
    auth: {
      persistSession: false
    }
  }
);
