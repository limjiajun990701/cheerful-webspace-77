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
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          date: string | null
          excerpt: string | null
          id: string
          imageurl: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          content: string
          date?: string | null
          excerpt?: string | null
          id?: string
          imageurl?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          content?: string
          date?: string | null
          excerpt?: string | null
          id?: string
          imageurl?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          credentialurl: string | null
          date: string
          description: string
          filetype: string
          fileurl: string
          id: string
          issuer: string
          name: string
        }
        Insert: {
          credentialurl?: string | null
          date?: string
          description: string
          filetype: string
          fileurl: string
          id?: string
          issuer: string
          name: string
        }
        Update: {
          credentialurl?: string | null
          date?: string
          description?: string
          filetype?: string
          fileurl?: string
          id?: string
          issuer?: string
          name?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          content: string | null
          date: string | null
          description: string
          filetype: string | null
          fileurl: string | null
          githuburl: string | null
          id: string
          imageurl: string | null
          liveurl: string | null
          slug: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          content?: string | null
          date?: string | null
          description: string
          filetype?: string | null
          fileurl?: string | null
          githuburl?: string | null
          id?: string
          imageurl?: string | null
          liveurl?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          content?: string | null
          date?: string | null
          description?: string
          filetype?: string | null
          fileurl?: string | null
          githuburl?: string | null
          id?: string
          imageurl?: string | null
          liveurl?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          id: string
          upload_date: string | null
          user_id: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size: number
          id?: string
          upload_date?: string | null
          user_id: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          upload_date?: string | null
          user_id?: string
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
