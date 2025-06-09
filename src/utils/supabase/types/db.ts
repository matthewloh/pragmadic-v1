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
      analytics_test_results: {
        Row: {
          category: string
          chat_id: string
          created_at: string | null
          data_accuracy: Json | null
          duration_ms: number | null
          end_time: string | null
          error_message: string | null
          id: string
          query: string
          session_id: string | null
          start_time: string | null
          success: boolean | null
          test_case_id: string
          tool_accuracy: Json | null
          tools_called: Json | null
        }
        Insert: {
          category: string
          chat_id: string
          created_at?: string | null
          data_accuracy?: Json | null
          duration_ms?: number | null
          end_time?: string | null
          error_message?: string | null
          id?: string
          query: string
          session_id?: string | null
          start_time?: string | null
          success?: boolean | null
          test_case_id: string
          tool_accuracy?: Json | null
          tools_called?: Json | null
        }
        Update: {
          category?: string
          chat_id?: string
          created_at?: string | null
          data_accuracy?: Json | null
          duration_ms?: number | null
          end_time?: string | null
          error_message?: string | null
          id?: string
          query?: string
          session_id?: string | null
          start_time?: string | null
          success?: boolean | null
          test_case_id?: string
          tool_accuracy?: Json | null
          tools_called?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_test_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "benchmark_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      benchmark_sessions: {
        Row: {
          created_at: string | null
          id: string
          model_label: string | null
          model_name: string
          provider: string | null
          selected_documents: Json | null
          status: string | null
          test_subset_type: string | null
          test_suite_version: string | null
          timestamp: string | null
          total_analytics_tests: number | null
          total_rag_tests: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          model_label?: string | null
          model_name: string
          provider?: string | null
          selected_documents?: Json | null
          status?: string | null
          test_subset_type?: string | null
          test_suite_version?: string | null
          timestamp?: string | null
          total_analytics_tests?: number | null
          total_rag_tests?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          model_label?: string | null
          model_name?: string
          provider?: string | null
          selected_documents?: Json | null
          status?: string | null
          test_subset_type?: string | null
          test_suite_version?: string | null
          timestamp?: string | null
          total_analytics_tests?: number | null
          total_rag_tests?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
            foreignKeyName: "chats_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "communities_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "community_event_invites_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "community_events_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "community_post_replies_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "community_posts_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "derantau_admin_profile_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_chunks: {
        Row: {
          content: string
          created_at: string
          document_id: string
          embedding: string
          file_path: string
          id: string
          metadata: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          document_id: string
          embedding: string
          file_path: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          document_id?: string
          embedding?: string
          file_path?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_documents_id_fk"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          body: string | null
          chunk_count: number | null
          content_type: string | null
          created_at: string
          id: string
          metadata: Json | null
          name: string
          object_id: string | null
          owner_id: string
          parent_id: string | null
          path: string | null
          path_tokens: string[] | null
          processed_at: string | null
          source_url: string | null
          status: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          chunk_count?: number | null
          content_type?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          name: string
          object_id?: string | null
          owner_id: string
          parent_id?: string | null
          path?: string | null
          path_tokens?: string[] | null
          processed_at?: string | null
          source_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          chunk_count?: number | null
          content_type?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string
          object_id?: string | null
          owner_id?: string
          parent_id?: string | null
          path?: string | null
          path_tokens?: string[] | null
          processed_at?: string | null
          source_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_owner_id_users_id_fk"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_markers: {
        Row: {
          address: string
          created_at: string
          end_time: string
          event_id: string
          event_type: string
          id: string
          latitude: number
          longitude: number
          object_id: string | null
          start_time: string
          updated_at: string
          user_id: string
          venue: string | null
        }
        Insert: {
          address: string
          created_at?: string
          end_time: string
          event_id: string
          event_type: string
          id: string
          latitude: number
          longitude: number
          object_id?: string | null
          start_time: string
          updated_at?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          end_time?: string
          event_id?: string
          event_type?: string
          id?: string
          latitude?: number
          longitude?: number
          object_id?: string | null
          start_time?: string
          updated_at?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_markers_event_id_hub_events_id_fk"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "hub_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_markers_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_events: {
        Row: {
          created_at: string
          description: string
          end_date: string
          hub_id: string
          id: string
          info: string | null
          is_complete: boolean
          name: string
          start_date: string
          type_of_event: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          hub_id: string
          id: string
          info?: string | null
          is_complete: boolean
          name: string
          start_date: string
          type_of_event: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          hub_id?: string
          id?: string
          info?: string | null
          is_complete?: boolean
          name?: string
          start_date?: string
          type_of_event?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_events_hub_id_hubs_id_fk"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_events_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_markers: {
        Row: {
          address: string
          amenities: Json | null
          created_at: string
          hub_id: string
          id: string
          latitude: number
          longitude: number
          object_id: string | null
          operating_hours: Json | null
          updated_at: string
          user_id: string
          venue: string | null
        }
        Insert: {
          address: string
          amenities?: Json | null
          created_at?: string
          hub_id: string
          id: string
          latitude: number
          longitude: number
          object_id?: string | null
          operating_hours?: Json | null
          updated_at?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          address?: string
          amenities?: Json | null
          created_at?: string
          hub_id?: string
          id?: string
          latitude?: number
          longitude?: number
          object_id?: string | null
          operating_hours?: Json | null
          updated_at?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hub_markers_hub_id_hubs_id_fk"
            columns: ["hub_id"]
            isOneToOne: true
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_markers_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "hub_owner_profiles_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
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
          {
            foreignKeyName: "hubs_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "nomad_profile_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
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
            foreignKeyName: "profile_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_test_results: {
        Row: {
          category: string
          chat_id: string
          created_at: string | null
          duration_ms: number | null
          end_time: string | null
          error_message: string | null
          finish_reason: string | null
          generated_text: string | null
          generation_metrics: Json | null
          id: string
          question: string
          retrieval_metrics: Json | null
          session_id: string | null
          start_time: string | null
          success: boolean | null
          test_case_id: string
          token_usage: Json | null
        }
        Insert: {
          category: string
          chat_id: string
          created_at?: string | null
          duration_ms?: number | null
          end_time?: string | null
          error_message?: string | null
          finish_reason?: string | null
          generated_text?: string | null
          generation_metrics?: Json | null
          id?: string
          question: string
          retrieval_metrics?: Json | null
          session_id?: string | null
          start_time?: string | null
          success?: boolean | null
          test_case_id: string
          token_usage?: Json | null
        }
        Update: {
          category?: string
          chat_id?: string
          created_at?: string | null
          duration_ms?: number | null
          end_time?: string | null
          error_message?: string | null
          finish_reason?: string | null
          generated_text?: string | null
          generation_metrics?: Json | null
          id?: string
          question?: string
          retrieval_metrics?: Json | null
          session_id?: string | null
          start_time?: string | null
          success?: boolean | null
          test_case_id?: string
          token_usage?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "rag_test_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "benchmark_sessions"
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
        Relationships: [
          {
            foreignKeyName: "regions_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      retrieved_chunks: {
        Row: {
          chunk_id: string
          created_at: string | null
          file_path: string | null
          id: string
          rag_result_id: string | null
          rank_position: number | null
          similarity_score: number | null
          source_document_id: string | null
        }
        Insert: {
          chunk_id: string
          created_at?: string | null
          file_path?: string | null
          id?: string
          rag_result_id?: string | null
          rank_position?: number | null
          similarity_score?: number | null
          source_document_id?: string | null
        }
        Update: {
          chunk_id?: string
          created_at?: string | null
          file_path?: string | null
          id?: string
          rag_result_id?: string | null
          rank_position?: number | null
          similarity_score?: number | null
          source_document_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retrieved_chunks_rag_result_id_fkey"
            columns: ["rag_result_id"]
            isOneToOne: false
            referencedRelation: "rag_test_results"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "reviews_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
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
            foreignKeyName: "user_roles_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          image_url: string | null
          roles: Database["public"]["Enums"]["user_role"][]
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email: string
          id?: string
          image_url?: string | null
          roles?: Database["public"]["Enums"]["user_role"][]
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          image_url?: string | null
          roles?: Database["public"]["Enums"]["user_role"][]
        }
        Relationships: []
      }
      users_to_communities: {
        Row: {
          community_id: string
          created_at: string
          member: Database["public"]["Enums"]["invite_role_type"] | null
          pending: Database["public"]["Enums"]["invite_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          member?: Database["public"]["Enums"]["invite_role_type"] | null
          pending?: Database["public"]["Enums"]["invite_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          member?: Database["public"]["Enums"]["invite_role_type"] | null
          pending?: Database["public"]["Enums"]["invite_status"] | null
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
            foreignKeyName: "users_to_communities_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_to_events: {
        Row: {
          created_at: string
          event_id: string
          member: Database["public"]["Enums"]["invite_role_type"] | null
          pending: Database["public"]["Enums"]["invite_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          member?: Database["public"]["Enums"]["invite_role_type"] | null
          pending?: Database["public"]["Enums"]["invite_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          member?: Database["public"]["Enums"]["invite_role_type"] | null
          pending?: Database["public"]["Enums"]["invite_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_to_events_event_id_hub_events_id_fk"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "hub_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_to_events_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_to_hubs: {
        Row: {
          created_at: string
          hub_id: string
          invite_role_type:
            | Database["public"]["Enums"]["invite_role_type"]
            | null
          invite_status: Database["public"]["Enums"]["invite_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hub_id: string
          invite_role_type?:
            | Database["public"]["Enums"]["invite_role_type"]
            | null
          invite_status?: Database["public"]["Enums"]["invite_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hub_id?: string
          invite_role_type?:
            | Database["public"]["Enums"]["invite_role_type"]
            | null
          invite_status?: Database["public"]["Enums"]["invite_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_to_hubs_hub_id_hubs_id_fk"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_to_hubs_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
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
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      set_user_role: {
        Args: { event: Json }
        Returns: Json
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      event_type:
        | "networking"
        | "workshop"
        | "social"
        | "coworking"
        | "cultural"
        | "tech_talk"
        | "community_meetup"
        | "skill_sharing"
        | "local_experience"
        | "business_showcase"
        | "other"
      invite_role_type: "admin" | "member"
      invite_status: "pending" | "accepted" | "rejected"
      user_app_permissions:
        | "hubs.create"
        | "hubs.view"
        | "hubs.update"
        | "hubs.delete"
        | "hubs.approve"
        | "hubs.posts.create"
        | "hubs.posts.view"
        | "hubs.posts.update"
        | "hubs.posts.delete"
        | "communities.create"
        | "communities.view"
        | "communities.update"
        | "communities.delete"
        | "communities.moderate"
        | "communities.posts.create"
        | "communities.posts.view"
        | "communities.posts.update"
        | "communities.posts.delete"
        | "regions.create"
        | "regions.view"
        | "regions.update"
        | "regions.delete"
        | "users.view"
        | "users.update"
        | "users.delete"
        | "users.roles.manage"
        | "reviews.create"
        | "reviews.view"
        | "reviews.update"
        | "reviews.delete"
        | "reviews.moderate"
      user_community_permissions:
        | "admin.invite"
        | "admin.remove"
        | "admin.ban"
        | "admin.edit"
        | "member.invite"
        | "member.remove"
        | "member.ban"
        | "member.edit"
      user_role: "regular" | "nomad" | "owner" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_type: [
        "networking",
        "workshop",
        "social",
        "coworking",
        "cultural",
        "tech_talk",
        "community_meetup",
        "skill_sharing",
        "local_experience",
        "business_showcase",
        "other",
      ],
      invite_role_type: ["admin", "member"],
      invite_status: ["pending", "accepted", "rejected"],
      user_app_permissions: [
        "hubs.create",
        "hubs.view",
        "hubs.update",
        "hubs.delete",
        "hubs.approve",
        "hubs.posts.create",
        "hubs.posts.view",
        "hubs.posts.update",
        "hubs.posts.delete",
        "communities.create",
        "communities.view",
        "communities.update",
        "communities.delete",
        "communities.moderate",
        "communities.posts.create",
        "communities.posts.view",
        "communities.posts.update",
        "communities.posts.delete",
        "regions.create",
        "regions.view",
        "regions.update",
        "regions.delete",
        "users.view",
        "users.update",
        "users.delete",
        "users.roles.manage",
        "reviews.create",
        "reviews.view",
        "reviews.update",
        "reviews.delete",
        "reviews.moderate",
      ],
      user_community_permissions: [
        "admin.invite",
        "admin.remove",
        "admin.ban",
        "admin.edit",
        "member.invite",
        "member.remove",
        "member.ban",
        "member.edit",
      ],
      user_role: ["regular", "nomad", "owner", "admin"],
    },
  },
} as const
