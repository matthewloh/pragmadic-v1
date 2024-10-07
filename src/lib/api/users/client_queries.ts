import { Client } from "@/utils/supabase/types"

export function getUserRolesQuery(client: Client) {
    return client.from("user_roles").select(
        `
          id,
          role,
          user(display_name)
      `,
    )
}
