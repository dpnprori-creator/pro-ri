// ============================================
// PRO RI DIGITAL COMMAND CENTER
// Supabase Database Type Definitions
// Generated from schema.sql & migrations
// ============================================

export interface Json {
  [key: string]: unknown;
}

export interface Database {
  public: {
    Tables: {
      provinces: {
        Row: {
          id: string;
          code: string;
          name: string;
          capital: string | null;
          latitude: number | null;
          longitude: number | null;
          total_members: number;
          total_trainers: number;
          total_mentors: number;
          total_events: number;
          total_innovations: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          capital?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          total_members?: number;
          total_trainers?: number;
          total_mentors?: number;
          total_events?: number;
          total_innovations?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          capital?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          total_members?: number;
          total_trainers?: number;
          total_mentors?: number;
          total_events?: number;
          total_innovations?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      regencies: {
        Row: {
          id: string;
          province_id: string;
          code: string;
          name: string;
          latitude: number | null;
          longitude: number | null;
          total_members: number;
          total_trainers: number;
          total_events: number;
          total_innovations: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          province_id: string;
          code: string;
          name: string;
          latitude?: number | null;
          longitude?: number | null;
          total_members?: number;
          total_trainers?: number;
          total_events?: number;
          total_innovations?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          province_id?: string;
          code?: string;
          name?: string;
          latitude?: number | null;
          longitude?: number | null;
          total_members?: number;
          total_trainers?: number;
          total_events?: number;
          total_innovations?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "regencies_province_id_fkey";
            columns: ["province_id"];
            referencedRelation: "provinces";
            referencedColumns: ["id"];
          }
        ];
      };
      districts: {
        Row: {
          id: string;
          regency_id: string;
          code: string;
          name: string;
          total_members: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          regency_id: string;
          code: string;
          name: string;
          total_members?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          regency_id?: string;
          code?: string;
          name?: string;
          total_members?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "districts_regency_id_fkey";
            columns: ["regency_id"];
            referencedRelation: "regencies";
            referencedColumns: ["id"];
          }
        ];
      };
      villages: {
        Row: {
          id: string;
          district_id: string;
          code: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          district_id: string;
          code: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          district_id?: string;
          code?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "villages_district_id_fkey";
            columns: ["district_id"];
            referencedRelation: "districts";
            referencedColumns: ["id"];
          }
        ];
      };
      roles: {
        Row: {
          id: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
        };
        Relationships: [];
      };
      members: {
        Row: {
          id: string;
          auth_id: string | null;
          member_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          province_id: string | null;
          regency_id: string | null;
          district_id: string | null;
          village_id: string | null;
          occupation: string | null;
          technology_interest: string[] | null;
          role_id: string | null;
          status: string;
          photo_url: string | null;
          qr_code: string | null;
          total_events_attended: number;
          total_certificates: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          member_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          province_id?: string | null;
          regency_id?: string | null;
          district_id?: string | null;
          village_id?: string | null;
          occupation?: string | null;
          technology_interest?: string[] | null;
          role_id?: string | null;
          status?: string;
          photo_url?: string | null;
          qr_code?: string | null;
          total_events_attended?: number;
          total_certificates?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string | null;
          member_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          province_id?: string | null;
          regency_id?: string | null;
          district_id?: string | null;
          village_id?: string | null;
          occupation?: string | null;
          technology_interest?: string[] | null;
          role_id?: string | null;
          status?: string;
          photo_url?: string | null;
          qr_code?: string | null;
          total_events_attended?: number;
          total_certificates?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "members_province_id_fkey";
            columns: ["province_id"];
            referencedRelation: "provinces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "members_regency_id_fkey";
            columns: ["regency_id"];
            referencedRelation: "regencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "members_district_id_fkey";
            columns: ["district_id"];
            referencedRelation: "districts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "members_village_id_fkey";
            columns: ["village_id"];
            referencedRelation: "villages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "members_role_id_fkey";
            columns: ["role_id"];
            referencedRelation: "roles";
            referencedColumns: ["id"];
          }
        ];
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          category: string;
          type: string;
          start_date: string;
          end_date: string;
          location: string | null;
          province_id: string | null;
          max_participants: number | null;
          banner_url: string | null;
          status: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          category: string;
          type?: string;
          start_date: string;
          end_date: string;
          location?: string | null;
          province_id?: string | null;
          max_participants?: number | null;
          banner_url?: string | null;
          status?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          category?: string;
          type?: string;
          start_date?: string;
          end_date?: string;
          location?: string | null;
          province_id?: string | null;
          max_participants?: number | null;
          banner_url?: string | null;
          status?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_province_id_fkey";
            columns: ["province_id"];
            referencedRelation: "provinces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          member_id: string;
          status: string;
          attended_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          member_id: string;
          status?: string;
          attended_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          member_id?: string;
          status?: string;
          attended_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey";
            columns: ["event_id"];
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_registrations_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      innovations: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          category: string;
          image_url: string | null;
          creator_id: string | null;
          province_id: string | null;
          year: number | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          category: string;
          image_url?: string | null;
          creator_id?: string | null;
          province_id?: string | null;
          year?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          category?: string;
          image_url?: string | null;
          creator_id?: string | null;
          province_id?: string | null;
          year?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "innovations_creator_id_fkey";
            columns: ["creator_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "innovations_province_id_fkey";
            columns: ["province_id"];
            referencedRelation: "provinces";
            referencedColumns: ["id"];
          }
        ];
      };
      certificates: {
        Row: {
          id: string;
          certificate_number: string;
          member_id: string;
          event_id: string | null;
          type: string;
          title: string;
          issued_at: string;
          verified: boolean;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          certificate_number: string;
          member_id: string;
          event_id?: string | null;
          type: string;
          title: string;
          issued_at?: string;
          verified?: boolean;
          pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          certificate_number?: string;
          member_id?: string;
          event_id?: string | null;
          type?: string;
          title?: string;
          issued_at?: string;
          verified?: boolean;
          pdf_url?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "certificates_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "certificates_event_id_fkey";
            columns: ["event_id"];
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
      news: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string | null;
          excerpt: string | null;
          image_url: string | null;
          author_id: string | null;
          category: string;
          status: string;
          published_at: string | null;
          is_featured: boolean | null;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string | null;
          excerpt?: string | null;
          image_url?: string | null;
          author_id?: string | null;
          category?: string;
          status?: string;
          published_at?: string | null;
          is_featured?: boolean | null;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string | null;
          excerpt?: string | null;
          image_url?: string | null;
          author_id?: string | null;
          category?: string;
          status?: string;
          published_at?: string | null;
          is_featured?: boolean | null;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      news_comments: {
        Row: {
          id: string;
          news_id: string;
          name: string;
          email: string | null;
          content: string;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          news_id: string;
          name: string;
          email?: string | null;
          content: string;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          news_id?: string;
          name?: string;
          email?: string | null;
          content?: string;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "news_comments_news_id_fkey";
            columns: ["news_id"];
            referencedRelation: "news";
            referencedColumns: ["id"];
          }
        ];
      };
      activity_logs: {
        Row: {
          id: string;
          member_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string | null;
          action?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      // Migration tables
      hero_gallery: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          link_url: string | null;
          link_label: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          link_url?: string | null;
          link_label?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          link_url?: string | null;
          link_label?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      activity_gallery: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          category: string;
          sort_order: number;
          is_active: boolean;
          date_taken: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          category: string;
          sort_order?: number;
          is_active?: boolean;
          date_taken?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          category?: string;
          sort_order?: number;
          is_active?: boolean;
          date_taken?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          video_url: string;
          poster_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          video_url: string;
          poster_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          video_url?: string;
          poster_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          icon: string;
          image_url: string | null;
          features: string[] | null;
          target_audience: string | null;
          status: string;
          label: string;
          max_participants: number | null;
          start_date: string | null;
          end_date: string | null;
          location: string | null;
          sort_order: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          icon?: string;
          image_url?: string | null;
          features?: string[] | null;
          target_audience?: string | null;
          status?: string;
          label?: string;
          max_participants?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          location?: string | null;
          sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          icon?: string;
          image_url?: string | null;
          features?: string[] | null;
          target_audience?: string | null;
          status?: string;
          label?: string;
          max_participants?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          location?: string | null;
          sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "programs_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      program_registrations: {
        Row: {
          id: string;
          program_id: string;
          member_id: string;
          status: string;
          notes: string | null;
          registered_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          member_id: string;
          status?: string;
          notes?: string | null;
          registered_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          member_id?: string;
          status?: string;
          notes?: string | null;
          registered_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "program_registrations_program_id_fkey";
            columns: ["program_id"];
            referencedRelation: "programs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "program_registrations_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      member_cards: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          nickname: string | null;
          family_count: number;
          gender: string | null;
          birth_place: string | null;
          birth_date: string | null;
          religion: string | null;
          nik: string | null;
          npwp: string | null;
          phone: string;
          email: string | null;
          address: string | null;
          postal_code: string | null;
          education: string | null;
          occupation: string | null;
          interests: string[] | null;
          skills: string[] | null;
          experience: string | null;
          motivation: string | null;
          photo_url: string | null;
          signature_url: string | null;
          status: string;
          member_number: string | null;
          rejection_reason: string | null;
          verified_by: string | null;
          verified_at: string | null;
          download_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          nickname?: string | null;
          family_count?: number;
          gender?: string | null;
          birth_place?: string | null;
          birth_date?: string | null;
          religion?: string | null;
          nik?: string | null;
          npwp?: string | null;
          phone: string;
          email?: string | null;
          address?: string | null;
          postal_code?: string | null;
          education?: string | null;
          occupation?: string | null;
          interests?: string[] | null;
          skills?: string[] | null;
          experience?: string | null;
          motivation?: string | null;
          photo_url?: string | null;
          signature_url?: string | null;
          status?: string;
          member_number?: string | null;
          rejection_reason?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          nickname?: string | null;
          family_count?: number;
          gender?: string | null;
          birth_place?: string | null;
          birth_date?: string | null;
          religion?: string | null;
          nik?: string | null;
          npwp?: string | null;
          phone?: string;
          email?: string | null;
          address?: string | null;
          postal_code?: string | null;
          education?: string | null;
          occupation?: string | null;
          interests?: string[] | null;
          skills?: string[] | null;
          experience?: string | null;
          motivation?: string | null;
          photo_url?: string | null;
          signature_url?: string | null;
          status?: string;
          member_number?: string | null;
          rejection_reason?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "member_cards_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "member_cards_verified_by_fkey";
            columns: ["verified_by"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      member_designations: {
        Row: {
          id: string;
          member_id: string;
          designation: string;
          certified_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          designation: string;
          certified_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          designation?: string;
          certified_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "member_designations_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      // ============================
      // ACADEMY TABLES
      // ============================
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          category: string;
          level: string;
          learning_path: string | null;
          image_url: string | null;
          duration_hours: number;
          total_lessons: number;
          status: string;
          created_by: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          category?: string;
          level?: string;
          learning_path?: string | null;
          image_url?: string | null;
          duration_hours?: number;
          total_lessons?: number;
          status?: string;
          created_by?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          category?: string;
          level?: string;
          learning_path?: string | null;
          image_url?: string | null;
          duration_hours?: number;
          total_lessons?: number;
          status?: string;
          created_by?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      course_modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          }
        ];
      };
      course_lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string | null;
          content: string | null;
          video_url: string | null;
          duration_minutes: number;
          is_free: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          description?: string | null;
          content?: string | null;
          video_url?: string | null;
          duration_minutes?: number;
          is_free?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          description?: string | null;
          content?: string | null;
          video_url?: string | null;
          duration_minutes?: number;
          is_free?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey";
            columns: ["module_id"];
            referencedRelation: "course_modules";
            referencedColumns: ["id"];
          }
        ];
      };
      course_enrollments: {
        Row: {
          id: string;
          course_id: string;
          member_id: string;
          status: string;
          progress_percent: number;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          course_id: string;
          member_id: string;
          status?: string;
          progress_percent?: number;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          course_id?: string;
          member_id?: string;
          status?: string;
          progress_percent?: number;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_enrollments_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      lesson_completions: {
        Row: {
          id: string;
          lesson_id: string;
          member_id: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          member_id: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          member_id?: string;
          completed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_completions_lesson_id_fkey";
            columns: ["lesson_id"];
            referencedRelation: "course_lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_completions_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      course_certificates: {
        Row: {
          id: string;
          certificate_number: string;
          course_id: string;
          member_id: string;
          issued_at: string;
          verified: boolean;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          certificate_number: string;
          course_id: string;
          member_id: string;
          issued_at?: string;
          verified?: boolean;
          pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          certificate_number?: string;
          course_id?: string;
          member_id?: string;
          issued_at?: string;
          verified?: boolean;
          pdf_url?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_certificates_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_certificates_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      lesson_attachments: {
        Row: {
          id: string;
          lesson_id: string;
          title: string;
          file_url: string;
          file_type: string;
          file_size: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          title: string;
          file_url: string;
          file_type?: string;
          file_size?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          title?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_attachments_lesson_id_fkey";
            columns: ["lesson_id"];
            referencedRelation: "course_lessons";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
