export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          content_type: string
          featured_image: string | null
          status: string
          published_at: string | null
          reading_time: number | null
          views: number
          created_at: string
          updated_at: string
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          content_type?: string
          featured_image?: string | null
          status?: string
          published_at?: string | null
          reading_time?: number | null
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          content_type?: string
          featured_image?: string | null
          status?: string
          published_at?: string | null
          reading_time?: number | null
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_name: string | null
          author_email: string | null
          author_id: string | null
          body: string
          is_approved: boolean
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_name?: string | null
          author_email?: string | null
          author_id?: string | null
          body: string
          is_approved?: boolean
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_name?: string | null
          author_email?: string | null
          author_id?: string | null
          body?: string
          is_approved?: boolean
          parent_id?: string | null
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
    }
  }
}
