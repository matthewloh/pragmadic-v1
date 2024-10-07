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
            assistant_responses: {
                Row: {
                    finish_reason: string | null
                    id: string
                    message_id: string
                    tool_invocations: string | null
                    usage: string | null
                }
                Insert: {
                    finish_reason?: string | null
                    id: string
                    message_id: string
                    tool_invocations?: string | null
                    usage?: string | null
                }
                Update: {
                    finish_reason?: string | null
                    id?: string
                    message_id?: string
                    tool_invocations?: string | null
                    usage?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "assistant_responses_message_id_messages_id_fk"
                        columns: ["message_id"]
                        isOneToOne: false
                        referencedRelation: "messages"
                        referencedColumns: ["id"]
                    },
                ]
            }
            chats: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    messages: Json
                    name: string | null
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id: string
                    messages: Json
                    name?: string | null
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    messages?: Json
                    name?: string | null
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "chats_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
            communities: {
                Row: {
                    created_at: string
                    description: string
                    id: string
                    is_public: boolean
                    name: string
                    rules: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    description: string
                    id: string
                    is_public: boolean
                    name: string
                    rules: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    description?: string
                    id?: string
                    is_public?: boolean
                    name?: string
                    rules?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "communities_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
            community_event_invites: {
                Row: {
                    accepted_at: string | null
                    community_event_id: string
                    created_at: string
                    id: string
                    invite_status: string
                    remarks: string | null
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    accepted_at?: string | null
                    community_event_id: string
                    created_at?: string
                    id: string
                    invite_status: string
                    remarks?: string | null
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    accepted_at?: string | null
                    community_event_id?: string
                    created_at?: string
                    id?: string
                    invite_status?: string
                    remarks?: string | null
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "community_event_invites_community_event_id_community_events_id_"
                        columns: ["community_event_id"]
                        isOneToOne: false
                        referencedRelation: "community_events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "community_event_invites_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
            community_events: {
                Row: {
                    community_id: string
                    completed_at: string | null
                    created_at: string
                    description: string
                    event_timestamp: string
                    event_type: string | null
                    id: string
                    is_complete: boolean
                    location: string
                    title: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    community_id: string
                    completed_at?: string | null
                    created_at?: string
                    description: string
                    event_timestamp: string
                    event_type?: string | null
                    id: string
                    is_complete: boolean
                    location: string
                    title: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    community_id?: string
                    completed_at?: string | null
                    created_at?: string
                    description?: string
                    event_timestamp?: string
                    event_type?: string | null
                    id?: string
                    is_complete?: boolean
                    location?: string
                    title?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "community_events_community_id_communities_id_fk"
                        columns: ["community_id"]
                        isOneToOne: false
                        referencedRelation: "communities"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "community_events_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
            community_post_replies: {
                Row: {
                    community_post_id: string
                    content: string
                    created_at: string
                    id: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    community_post_id: string
                    content: string
                    created_at?: string
                    id: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    community_post_id?: string
                    content?: string
                    created_at?: string
                    id?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "community_post_replies_community_post_id_community_posts_id_fk"
                        columns: ["community_post_id"]
                        isOneToOne: false
                        referencedRelation: "community_posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "community_post_replies_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
            community_posts: {
                Row: {
                    category: string | null
                    community_id: string
                    content: string
                    created_at: string
                    id: string
                    is_public: boolean
                    title: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    category?: string | null
                    community_id: string
                    content: string
                    created_at?: string
                    id: string
                    is_public: boolean
                    title: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    category?: string | null
                    community_id?: string
                    content?: string
                    created_at?: string
                    id?: string
                    is_public?: boolean
                    title?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "community_posts_community_id_communities_id_fk"
                        columns: ["community_id"]
                        isOneToOne: false
                        referencedRelation: "communities"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "community_posts_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
            derantau_admin_profile: {
                Row: {
                    admin_level: string
                    created_at: string
                    department: string
                    id: string
                    position: string
                    region_id: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    admin_level: string
                    created_at?: string
                    department: string
                    id: string
                    position: string
                    region_id: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    admin_level?: string
                    created_at?: string
                    department?: string
                    id?: string
                    position?: string
                    region_id?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "derantau_admin_profile_region_id_regions_id_fk"
                        columns: ["region_id"]
                        isOneToOne: false
                        referencedRelation: "regions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "derantau_admin_profile_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
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
            events: {
                Row: {
                    completion_date: string | null
                    created_at: string
                    description: string
                    event_date: string
                    hub_id: string
                    id: string
                    info: string | null
                    is_complete: boolean
                    name: string
                    type_of_event: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    completion_date?: string | null
                    created_at?: string
                    description: string
                    event_date: string
                    hub_id: string
                    id: string
                    info?: string | null
                    is_complete: boolean
                    name: string
                    type_of_event: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    completion_date?: string | null
                    created_at?: string
                    description?: string
                    event_date?: string
                    hub_id?: string
                    id?: string
                    info?: string | null
                    is_complete?: boolean
                    name?: string
                    type_of_event?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "events_hub_id_hubs_id_fk"
                        columns: ["hub_id"]
                        isOneToOne: false
                        referencedRelation: "hubs"
                        referencedColumns: ["id"]
                    },
                ]
            }
            hub_owner_profiles: {
                Row: {
                    bio: string
                    business_contact_no: string
                    business_email: string
                    business_location: string
                    business_registration_number: string | null
                    company_name: string | null
                    created_at: string
                    id: string
                    residing_location: string
                    social_media_handles: string | null
                    updated_at: string
                    user_id: string
                    website_url: string | null
                }
                Insert: {
                    bio: string
                    business_contact_no: string
                    business_email: string
                    business_location: string
                    business_registration_number?: string | null
                    company_name?: string | null
                    created_at?: string
                    id: string
                    residing_location: string
                    social_media_handles?: string | null
                    updated_at?: string
                    user_id: string
                    website_url?: string | null
                }
                Update: {
                    bio?: string
                    business_contact_no?: string
                    business_email?: string
                    business_location?: string
                    business_registration_number?: string | null
                    company_name?: string | null
                    created_at?: string
                    id?: string
                    residing_location?: string
                    social_media_handles?: string | null
                    updated_at?: string
                    user_id?: string
                    website_url?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "hub_owner_profiles_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
            hubs: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    info: string | null
                    name: string
                    public: boolean
                    state_id: string
                    type_of_hub: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id: string
                    info?: string | null
                    name: string
                    public: boolean
                    state_id: string
                    type_of_hub: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    info?: string | null
                    name?: string
                    public?: boolean
                    state_id?: string
                    type_of_hub?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "hubs_state_id_states_id_fk"
                        columns: ["state_id"]
                        isOneToOne: false
                        referencedRelation: "states"
                        referencedColumns: ["id"]
                    },
                ]
            }
            messages: {
                Row: {
                    chat_id: string
                    content: string
                    created_at: string
                    id: string
                    role: string
                    updated_at: string
                }
                Insert: {
                    chat_id: string
                    content: string
                    created_at?: string
                    id: string
                    role: string
                    updated_at?: string
                }
                Update: {
                    chat_id?: string
                    content?: string
                    created_at?: string
                    id?: string
                    role?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_chat_id_chats_id_fk"
                        columns: ["chat_id"]
                        isOneToOne: false
                        referencedRelation: "chats"
                        referencedColumns: ["id"]
                    },
                ]
            }
            nomad_profile: {
                Row: {
                    bio: string | null
                    contact_information: string | null
                    created_at: string
                    current_location: string | null
                    id: string
                    interests: string | null
                    skills: string | null
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    bio?: string | null
                    contact_information?: string | null
                    created_at?: string
                    current_location?: string | null
                    id: string
                    interests?: string | null
                    skills?: string | null
                    updated_at?: string
                    user_id?: string
                }
                Update: {
                    bio?: string | null
                    contact_information?: string | null
                    created_at?: string
                    current_location?: string | null
                    id?: string
                    interests?: string | null
                    skills?: string | null
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nomad_profile_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profile: {
                Row: {
                    bio: string
                    contact_number: string | null
                    created_at: string
                    id: string
                    location: string | null
                    occupation: string | null
                    social_links: string | null
                    updated_at: string
                    user_id: string
                    website: string
                }
                Insert: {
                    bio: string
                    contact_number?: string | null
                    created_at?: string
                    id: string
                    location?: string | null
                    occupation?: string | null
                    social_links?: string | null
                    updated_at?: string
                    user_id: string
                    website: string
                }
                Update: {
                    bio?: string
                    contact_number?: string | null
                    created_at?: string
                    id?: string
                    location?: string | null
                    occupation?: string | null
                    social_links?: string | null
                    updated_at?: string
                    user_id?: string
                    website?: string
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
            regions: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    name: string
                    public: boolean
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id: string
                    name: string
                    public: boolean
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    name?: string
                    public?: boolean
                    updated_at?: string
                    user_id?: string
                }
                Relationships: []
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
            reviews: {
                Row: {
                    content: string
                    created_at: string
                    hub_id: string
                    id: string
                    photo_url: string | null
                    rating: number
                    title: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    content: string
                    created_at?: string
                    hub_id: string
                    id: string
                    photo_url?: string | null
                    rating: number
                    title: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    content?: string
                    created_at?: string
                    hub_id?: string
                    id?: string
                    photo_url?: string | null
                    rating?: number
                    title?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reviews_hub_id_hubs_id_fk"
                        columns: ["hub_id"]
                        isOneToOne: false
                        referencedRelation: "hubs"
                        referencedColumns: ["id"]
                    },
                ]
            }
            role_permissions: {
                Row: {
                    id: string
                    permission: Database["public"]["Enums"]["user_app_permissions"]
                    role: Database["public"]["Enums"]["user_role"]
                }
                Insert: {
                    id: string
                    permission: Database["public"]["Enums"]["user_app_permissions"]
                    role: Database["public"]["Enums"]["user_role"]
                }
                Update: {
                    id?: string
                    permission?: Database["public"]["Enums"]["user_app_permissions"]
                    role?: Database["public"]["Enums"]["user_role"]
                }
                Relationships: []
            }
            states: {
                Row: {
                    approved_at: string | null
                    capital_city: string
                    created_at: string
                    description: string
                    id: string
                    name: string
                    population: number
                    region_id: string
                    updated_at: string
                }
                Insert: {
                    approved_at?: string | null
                    capital_city: string
                    created_at?: string
                    description: string
                    id: string
                    name: string
                    population: number
                    region_id: string
                    updated_at?: string
                }
                Update: {
                    approved_at?: string | null
                    capital_city?: string
                    created_at?: string
                    description?: string
                    id?: string
                    name?: string
                    population?: number
                    region_id?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "states_region_id_regions_id_fk"
                        columns: ["region_id"]
                        isOneToOne: false
                        referencedRelation: "regions"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user: {
                Row: {
                    created_at: string | null
                    display_name: string | null
                    email: string
                    id: string
                    image_url: string | null
                    role: Database["public"]["Enums"]["user_role"]
                }
                Insert: {
                    created_at?: string | null
                    display_name?: string | null
                    email: string
                    id?: string
                    image_url?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                }
                Update: {
                    created_at?: string | null
                    display_name?: string | null
                    email?: string
                    id?: string
                    image_url?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
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
            user_roles: {
                Row: {
                    id: string
                    role: Database["public"]["Enums"]["user_role"]
                    user_id: string
                }
                Insert: {
                    id: string
                    role: Database["public"]["Enums"]["user_role"]
                    user_id: string
                }
                Update: {
                    id?: string
                    role?: Database["public"]["Enums"]["user_role"]
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_roles_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "user"
                        referencedColumns: ["id"]
                    },
                ]
            }
            users_to_communities: {
                Row: {
                    community_id: string
                    created_at: string
                    member:
                        | Database["public"]["Enums"]["invite_role_type"]
                        | null
                    pending: Database["public"]["Enums"]["invite_status"] | null
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    community_id: string
                    created_at?: string
                    member?:
                        | Database["public"]["Enums"]["invite_role_type"]
                        | null
                    pending?:
                        | Database["public"]["Enums"]["invite_status"]
                        | null
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    community_id?: string
                    created_at?: string
                    member?:
                        | Database["public"]["Enums"]["invite_role_type"]
                        | null
                    pending?:
                        | Database["public"]["Enums"]["invite_status"]
                        | null
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "users_to_communities_community_id_communities_id_fk"
                        columns: ["community_id"]
                        isOneToOne: false
                        referencedRelation: "communities"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "users_to_communities_user_id_user_id_fk"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "user"
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
            set_user_role: {
                Args: {
                    event: Json
                }
                Returns: Json
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
            invite_role_type: "admin" | "member"
            invite_status: "pending" | "accepted" | "rejected"
            user_app_permissions:
                | "hubs.create"
                | "hubs.delete"
                | "hubs.posts.create"
                | "communities.posts.create"
            user_community_permissions:
                | "admin.invite"
                | "admin.remove"
                | "admin.ban"
                | "admin.edit"
                | "member.invite"
                | "member.remove"
                | "member.ban"
                | "member.edit"
            user_role: "regular" | "owner" | "admin"
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

