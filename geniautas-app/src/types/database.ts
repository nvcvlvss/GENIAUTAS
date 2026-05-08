export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      access_requests: {
        Row: {
          avatar_id: string
          created_at: string
          id: string
          proposed_student_session_id: string | null
          session_id: string
          status: Database["public"]["Enums"]["request_status"]
          student_last_name: string
          student_name: string
        }
        Insert: {
          avatar_id: string
          created_at?: string
          id?: string
          proposed_student_session_id?: string | null
          session_id: string
          status?: Database["public"]["Enums"]["request_status"]
          student_last_name: string
          student_name: string
        }
        Update: {
          avatar_id?: string
          created_at?: string
          id?: string
          proposed_student_session_id?: string | null
          session_id?: string
          status?: Database["public"]["Enums"]["request_status"]
          student_last_name?: string
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          content_snapshot: string | null
          created_at: string
          id: string
          is_resolved: boolean | null
          session_id: string
          student_session_id: string
          type: Database["public"]["Enums"]["alert_type"]
        }
        Insert: {
          content_snapshot?: string | null
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          session_id: string
          student_session_id: string
          type: Database["public"]["Enums"]["alert_type"]
        }
        Update: {
          content_snapshot?: string | null
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          session_id?: string
          student_session_id?: string
          type?: Database["public"]["Enums"]["alert_type"]
        }
        Relationships: [
          {
            foreignKeyName: "alerts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_student_session_id_fkey"
            columns: ["student_session_id"]
            isOneToOne: false
            referencedRelation: "student_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_flagged: boolean | null
          moderation_reason: string | null
          role: Database["public"]["Enums"]["message_role"]
          student_session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_flagged?: boolean | null
          moderation_reason?: string | null
          role: Database["public"]["Enums"]["message_role"]
          student_session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_flagged?: boolean | null
          moderation_reason?: string | null
          role?: Database["public"]["Enums"]["message_role"]
          student_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_student_session_id_fkey"
            columns: ["student_session_id"]
            isOneToOne: false
            referencedRelation: "student_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          school_id: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          school_id?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          school_id?: string | null
        }
        Relationships: []
      }
      roadmap_tasks: {
        Row: {
          created_at: string
          id: string
          order_index: number
          session_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_index: number
          session_id: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
          session_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_tasks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      session_join_requests: {
        Row: {
          avatar_id: string | null
          course_id: string | null
          created_at: string
          id: string
          matched_student_id: string | null
          proposed_student_session_id: string | null
          school_id: string | null
          session_id: string
          status: Database["public"]["Enums"]["request_status"] | null
          student_candidate_name: string
          student_candidate_normalized: string | null
        }
        Insert: {
          avatar_id?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          matched_student_id?: string | null
          proposed_student_session_id?: string | null
          school_id?: string | null
          session_id: string
          status?: Database["public"]["Enums"]["request_status"] | null
          student_candidate_name: string
          student_candidate_normalized?: string | null
        }
        Update: {
          avatar_id?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          matched_student_id?: string | null
          proposed_student_session_id?: string | null
          school_id?: string | null
          session_id?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          student_candidate_name?: string
          student_candidate_normalized?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_join_requests_proposed_student_session_id_fkey"
            columns: ["proposed_student_session_id"]
            isOneToOne: false
            referencedRelation: "student_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_join_requests_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          agent_config: Database["public"]["Enums"]["agent_type"]
          created_at: string
          grade: Database["public"]["Enums"]["grade"]
          id: string
          last_activity_at: string
          pedagogical_objective: string
          school_id: string
          status: Database["public"]["Enums"]["session_status"]
          teacher_id: string
          title: string
        }
        Insert: {
          agent_config?: Database["public"]["Enums"]["agent_type"]
          created_at?: string
          grade: Database["public"]["Enums"]["grade"]
          id?: string
          last_activity_at?: string
          pedagogical_objective: string
          school_id: string
          status?: Database["public"]["Enums"]["session_status"]
          teacher_id: string
          title: string
        }
        Update: {
          agent_config?: Database["public"]["Enums"]["agent_type"]
          created_at?: string
          grade?: Database["public"]["Enums"]["grade"]
          id?: string
          last_activity_at?: string
          pedagogical_objective?: string
          school_id?: string
          status?: Database["public"]["Enums"]["session_status"]
          teacher_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_sessions: {
        Row: {
          avatar_id: string
          created_at: string
          full_name: string
          id: string
          is_active: boolean | null
          session_id: string
          student_index: number | null
        }
        Insert: {
          avatar_id: string
          created_at?: string
          full_name: string
          id?: string
          is_active?: boolean | null
          session_id: string
          student_index?: number | null
        }
        Update: {
          avatar_id?: string
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          session_id?: string
          student_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      student_task_progress: {
        Row: {
          completed_at: string | null
          id: string
          is_completed: boolean | null
          reflection_text: string | null
          student_session_id: string
          task_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          reflection_text?: string | null
          student_session_id: string
          task_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          reflection_text?: string | null
          student_session_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_task_progress_student_session_id_fkey"
            columns: ["student_session_id"]
            isOneToOne: false
            referencedRelation: "student_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_task_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "roadmap_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_type: "constructivista" | "cognitivista" | "neutro"
      alert_type: "security" | "pedagogical" | "technical"
      grade:
        | "4┬░ B├ísico A"
        | "4┬░ B├ísco B"
        | "4┬░ B├ísico C"
        | "5┬░ B├ísico A"
        | "5┬░ B├ísico B"
        | "5┬░ B├ísico C"
        | "6┬░ B├ísico A"
        | "6┬░ B├ísico B"
        | "6┬░ B├ísico C"
      message_role: "user" | "assistant" | "system"
      request_status: "pending" | "approved" | "rejected"
      session_status: "draft" | "active" | "paused" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_type: ["constructivista", "cognitivista", "neutro"],
      alert_type: ["security", "pedagogical", "technical"],
      grade: [
        "4┬░ B├ísico A",
        "4┬░ B├ísco B",
        "4┬░ B├ísico C",
        "5┬░ B├ísico A",
        "5┬░ B├ísico B",
        "5┬░ B├ísico C",
        "6┬░ B├ísico A",
        "6┬░ B├ísico B",
        "6┬░ B├ísico C",
      ],
      message_role: ["user", "assistant", "system"],
      request_status: ["pending", "approved", "rejected"],
      session_status: ["draft", "active", "paused", "closed"],
    },
  },
} as const
