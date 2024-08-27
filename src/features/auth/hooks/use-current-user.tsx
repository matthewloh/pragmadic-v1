import { createClient } from "@/utils/supabase/client";

export function useCurrentUser() {
  const supabase = createClient();
  return supabase.auth.getUser();
}
