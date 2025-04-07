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
      deals: {
        Row: {
          address: string | null
          cap_rate: string | null
          city: string | null
          created_at: string
          created_by: string
          due_date: string | null
          id: string
          irr: string | null
          name: string
          notes: string | null
          price: string | null
          priority: string | null
          property_id: string
          property_type: string | null
          state: string | null
          status: string
          team_members: string[]
        }
        Insert: {
          address?: string | null
          cap_rate?: string | null
          city?: string | null
          created_at?: string
          created_by: string
          due_date?: string | null
          id?: string
          irr?: string | null
          name: string
          notes?: string | null
          price?: string | null
          priority?: string | null
          property_id: string
          property_type?: string | null
          state?: string | null
          status: string
          team_members?: string[]
        }
        Update: {
          address?: string | null
          cap_rate?: string | null
          city?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: string
          irr?: string | null
          name?: string
          notes?: string | null
          price?: string | null
          priority?: string | null
          property_id?: string
          property_type?: string | null
          state?: string | null
          status?: string
          team_members?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "deals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          deal_id: string
          document_type: string
          file_url: string
          id: string
          name: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          document_type: string
          file_url: string
          id?: string
          name: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          document_type?: string
          file_url?: string
          id?: string
          name?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          acquisition_price: number
          address: string
          cap_rate: number
          city: string
          created_at: string
          created_by: string
          id: string
          name: string
          property_type: string
          size: number
          state: string
        }
        Insert: {
          acquisition_price: number
          address: string
          cap_rate: number
          city: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          property_type: string
          size: number
          state: string
        }
        Update: {
          acquisition_price?: number
          address?: string
          cap_rate?: number
          city?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          property_type?: string
          size?: number
          state?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string
          created_at: string
          created_by: string
          deal_id: string
          description: string | null
          due_date: string
          id: string
          status: string
          title: string
        }
        Insert: {
          assigned_to: string
          created_at?: string
          created_by: string
          deal_id: string
          description?: string | null
          due_date: string
          id?: string
          status: string
          title: string
        }
        Update: {
          assigned_to?: string
          created_at?: string
          created_by?: string
          deal_id?: string
          description?: string | null
          due_date?: string
          id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: string
        }
        Relationships: []
      }
      valuations: {
        Row: {
          ai_forecast_outputs: Json
          created_at: string
          created_by: string
          id: string
          model_inputs: Json
          property_id: string
        }
        Insert: {
          ai_forecast_outputs: Json
          created_at?: string
          created_by: string
          id?: string
          model_inputs: Json
          property_id: string
        }
        Update: {
          ai_forecast_outputs?: Json
          created_at?: string
          created_by?: string
          id?: string
          model_inputs?: Json
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "valuations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
