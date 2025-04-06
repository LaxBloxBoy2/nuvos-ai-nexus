
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define database types
export type UserRole = 'Investor' | 'Analyst' | 'Admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  property_type: string;
  city: string;
  state: string;
  size: number;
  acquisition_price: number;
  cap_rate: number;
  created_by: string;
  created_at: string;
}

export interface Valuation {
  id: string;
  property_id: string;
  model_inputs: Record<string, any>;
  ai_forecast_outputs: Record<string, any>;
  created_at: string;
  created_by: string;
}

export interface Deal {
  id: string;
  name: string;
  property_id: string;
  status: 'Screening' | 'Due Diligence' | 'Negotiation' | 'Closing' | 'Closed' | 'Dead';
  team_members: string[];
  notes: string;
  created_at: string;
  created_by: string;
  price: string;
  cap_rate: string;
  irr: string;
  priority?: 'High' | 'Medium' | 'Low';
  dueDate?: string;
  address?: string;
  city?: string;
  state?: string;
  property_type?: string;
}

export interface Task {
  id: string;
  deal_id: string;
  title: string;
  description?: string;
  assigned_to: string;
  due_date: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  created_at: string;
  created_by: string;
}

export interface Document {
  id: string;
  deal_id: string;
  name: string;
  file_url: string;
  uploaded_by: string;
  document_type: string;
  created_at: string;
}
