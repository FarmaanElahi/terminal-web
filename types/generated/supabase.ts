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
      alerts: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_active: boolean
          last_triggered_at: string | null
          last_triggered_price: number | null
          lhs_attr: Json | null
          lhs_type: Database["public"]["Enums"]["alert_lhs_type"]
          notes: string | null
          operator: string
          rhs_attr: Json
          rhs_type: Database["public"]["Enums"]["alert_rhs_type"]
          symbol: string
          triggered_count: number
          type: Database["public"]["Enums"]["alert_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          last_triggered_price?: number | null
          lhs_attr?: Json | null
          lhs_type: Database["public"]["Enums"]["alert_lhs_type"]
          notes?: string | null
          operator: string
          rhs_attr: Json
          rhs_type: Database["public"]["Enums"]["alert_rhs_type"]
          symbol: string
          triggered_count?: number
          type: Database["public"]["Enums"]["alert_type"]
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          last_triggered_price?: number | null
          lhs_attr?: Json | null
          lhs_type?: Database["public"]["Enums"]["alert_lhs_type"]
          notes?: string | null
          operator?: string
          rhs_attr?: Json
          rhs_type?: Database["public"]["Enums"]["alert_rhs_type"]
          symbol?: string
          triggered_count?: number
          type?: Database["public"]["Enums"]["alert_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chart_drawings: {
        Row: {
          chart_id: string | null
          created_at: string
          id: string
          layout_id: string | null
          ownerSource: string | null
          state: Json | null
          symbol: string
          user_id: string | null
        }
        Insert: {
          chart_id?: string | null
          created_at?: string
          id: string
          layout_id?: string | null
          ownerSource?: string | null
          state?: Json | null
          symbol: string
          user_id?: string | null
        }
        Update: {
          chart_id?: string | null
          created_at?: string
          id?: string
          layout_id?: string | null
          ownerSource?: string | null
          state?: Json | null
          symbol?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chart_layouts: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          name: string | null
          resolution: string | null
          symbol: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          name?: string | null
          resolution?: string | null
          symbol?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          name?: string | null
          resolution?: string | null
          symbol?: string | null
        }
        Relationships: []
      }
      chart_templates: {
        Row: {
          content: Json | null
          created_at: string
          name: string
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          name: string
          user_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      dashboards: {
        Row: {
          created_at: string
          id: string
          layout: Json | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          layout?: Json | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          layout?: Json | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      data_panels: {
        Row: {
          created_at: string
          id: string
          name: string
          sections: Json
          udpated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sections?: Json
          udpated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sections?: Json
          udpated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      screens: {
        Row: {
          created_at: string
          id: string
          name: string
          state: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          state?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          state?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      study_templates: {
        Row: {
          content: Json | null
          created_at: string
          name: string
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          name: string
          user_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          access_token: string | null
          created_at: string
          id: number
          provider_id: string | null
          provider_profile: Json
          type: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: number
          provider_id?: string | null
          provider_profile: Json
          type?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: number
          provider_id?: string | null
          provider_profile?: Json
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          active: boolean
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          lists: string[] | null
          name: string
          shared: boolean
          state: Json | null
          symbols: string[]
          type: Database["public"]["Enums"]["watchlist_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          lists?: string[] | null
          name?: string
          shared?: boolean
          state?: Json | null
          symbols?: string[]
          type?: Database["public"]["Enums"]["watchlist_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          lists?: string[] | null
          name?: string
          shared?: boolean
          state?: Json | null
          symbols?: string[]
          type?: Database["public"]["Enums"]["watchlist_type"]
          updated_at?: string | null
          user_id?: string | null
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
      alert_lhs_type: "last_price"
      alert_rhs_type: "constant" | "trend_line"
      alert_type: "simple"
      watchlist_type: "custom" | "colored" | "combo"
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
      alert_lhs_type: ["last_price"],
      alert_rhs_type: ["constant", "trend_line"],
      alert_type: ["simple"],
      watchlist_type: ["custom", "colored", "combo"],
    },
  },
} as const
