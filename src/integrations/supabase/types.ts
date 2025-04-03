
// The types remain the same as they describe the database structure
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
      evaluations: {
        Row: {
          articulation: number
          created_at: string
          evaluator_id: string
          gd_session_id: string
          id: string
          impression: number
          leadership: number
          non_verbal_communication: number
          relevance: number
          student_id: string
        }
        Insert: {
          articulation: number
          created_at?: string
          evaluator_id: string
          gd_session_id: string
          id?: string
          impression: number
          leadership: number
          non_verbal_communication: number
          relevance: number
          student_id: string
        }
        Update: {
          articulation?: number
          created_at?: string
          evaluator_id?: string
          gd_session_id?: string
          id?: string
          impression?: number
          leadership?: number
          non_verbal_communication?: number
          relevance?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_evaluator_id_fkey"
            columns: ["evaluator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_gd_session_id_fkey"
            columns: ["gd_session_id"]
            isOneToOne: false
            referencedRelation: "gd_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gd_evaluators: {
        Row: {
          created_at: string
          evaluator_id: string
          gd_session_id: string
          id: string
        }
        Insert: {
          created_at?: string
          evaluator_id: string
          gd_session_id: string
          id?: string
        }
        Update: {
          created_at?: string
          evaluator_id?: string
          gd_session_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gd_evaluators_evaluator_id_fkey"
            columns: ["evaluator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gd_evaluators_gd_session_id_fkey"
            columns: ["gd_session_id"]
            isOneToOne: false
            referencedRelation: "gd_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      gd_participants: {
        Row: {
          created_at: string
          gd_session_id: string
          id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          gd_session_id: string
          id?: string
          student_id: string
        }
        Update: {
          created_at?: string
          gd_session_id?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gd_participants_gd_session_id_fkey"
            columns: ["gd_session_id"]
            isOneToOne: false
            referencedRelation: "gd_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gd_participants_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gd_sessions: {
        Row: {
          created_at: string
          created_by: string
          date: string
          details: string
          group_name: string
          group_number: string
          id: string
          topic: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          details: string
          group_name: string
          group_number: string
          id?: string
          topic: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          details?: string
          group_name?: string
          group_number?: string
          id?: string
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "gd_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          designation: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          roll_number: string | null
          section: string | null
          year: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          designation?: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          roll_number?: string | null
          section?: string | null
          year?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          designation?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          roll_number?: string | null
          section?: string | null
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "student" | "instructor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Rest of the type definitions remain the same
type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
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
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
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
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never