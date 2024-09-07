export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            embeddings: {
                Row: {
                    content: string
                    embedding: string
                    id: string
                    resource_id: string | null
                }
                Insert: {
                    content: string
                    embedding: string
                    id: string
                    resource_id?: string | null
                }
                Update: {
                    content?: string
                    embedding?: string
                    id?: string
                    resource_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "embeddings_resource_id_resources_id_fk"
                        columns: ["resource_id"]
                        isOneToOne: false
                        referencedRelation: "resources"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profile: {
                Row: {
                    bio: string
                    id: string
                    location: string | null
                    occupation: string | null
                    updated_at: string | null
                    user_id: string
                    website: string | null
                }
                Insert: {
                    bio: string
                    id?: string
                    location?: string | null
                    occupation?: string | null
                    updated_at?: string | null
                    user_id: string
                    website?: string | null
                }
                Update: {
                    bio?: string
                    id?: string
                    location?: string | null
                    occupation?: string | null
                    updated_at?: string | null
                    user_id?: string
                    website?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profile_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
            resources: {
                Row: {
                    content: string
                    created_at: string
                    id: string
                    updated_at: string
                }
                Insert: {
                    content: string
                    created_at?: string
                    id: string
                    updated_at?: string
                }
                Update: {
                    content?: string
                    created_at?: string
                    id?: string
                    updated_at?: string
                }
                Relationships: []
            }
            user: {
                Row: {
                    created_at: string | null
                    display_name: string | null
                    email: string
                    id: string
                    image_url: string | null
                }
                Insert: {
                    created_at?: string | null
                    display_name?: string | null
                    email: string
                    id?: string
                    image_url?: string | null
                }
                Update: {
                    created_at?: string | null
                    display_name?: string | null
                    email?: string
                    id?: string
                    image_url?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_id_users_id_fk"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            binary_quantize:
                | {
                      Args: {
                          "": string
                      }
                      Returns: unknown
                  }
                | {
                      Args: {
                          "": unknown
                      }
                      Returns: unknown
                  }
            halfvec_avg: {
                Args: {
                    "": number[]
                }
                Returns: unknown
            }
            halfvec_out: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            halfvec_send: {
                Args: {
                    "": unknown
                }
                Returns: string
            }
            halfvec_typmod_in: {
                Args: {
                    "": unknown[]
                }
                Returns: number
            }
            hnsw_bit_support: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            hnsw_halfvec_support: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            hnsw_sparsevec_support: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            hnswhandler: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            ivfflat_bit_support: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            ivfflat_halfvec_support: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            ivfflathandler: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            l2_norm:
                | {
                      Args: {
                          "": unknown
                      }
                      Returns: number
                  }
                | {
                      Args: {
                          "": unknown
                      }
                      Returns: number
                  }
            l2_normalize:
                | {
                      Args: {
                          "": string
                      }
                      Returns: string
                  }
                | {
                      Args: {
                          "": unknown
                      }
                      Returns: unknown
                  }
                | {
                      Args: {
                          "": unknown
                      }
                      Returns: unknown
                  }
            sparsevec_out: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            sparsevec_send: {
                Args: {
                    "": unknown
                }
                Returns: string
            }
            sparsevec_typmod_in: {
                Args: {
                    "": unknown[]
                }
                Returns: number
            }
            vector_avg: {
                Args: {
                    "": number[]
                }
                Returns: string
            }
            vector_dims:
                | {
                      Args: {
                          "": string
                      }
                      Returns: number
                  }
                | {
                      Args: {
                          "": unknown
                      }
                      Returns: number
                  }
            vector_norm: {
                Args: {
                    "": string
                }
                Returns: number
            }
            vector_out: {
                Args: {
                    "": string
                }
                Returns: unknown
            }
            vector_send: {
                Args: {
                    "": string
                }
                Returns: string
            }
            vector_typmod_in: {
                Args: {
                    "": unknown[]
                }
                Returns: number
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
              Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
            PublicSchema["Views"])
      ? (PublicSchema["Tables"] &
            PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
          ? R
          : never
      : never

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
      ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Insert: infer I
        }
          ? I
          : never
      : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
      ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Update: infer U
        }
          ? U
          : never
      : never

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
      ? PublicSchema["Enums"][PublicEnumNameOrOptions]
      : never
