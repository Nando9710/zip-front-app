import { environment } from "./src/environments/environment";
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
