
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase, Property, Deal, Task, Document, Valuation } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface DataContextType {
  // Properties
  properties: Property[];
  loadingProperties: boolean;
  createProperty: (property: Omit<Property, 'id' | 'created_at' | 'created_by'>) => Promise<string | null>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<boolean>;
  deleteProperty: (id: string) => Promise<boolean>;
  getPropertyById: (id: string) => Promise<Property | null>;
  
  // Deals
  deals: Deal[];
  loadingDeals: boolean;
  createDeal: (deal: Omit<Deal, 'id' | 'created_at' | 'created_by'>) => Promise<string | null>;
  updateDeal: (id: string, deal: Partial<Deal>) => Promise<boolean>;
  deleteDeal: (id: string) => Promise<boolean>;
  getDealById: (id: string) => Promise<Deal | null>;
  
  // Tasks
  tasks: Task[];
  loadingTasks: boolean;
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'created_by'>) => Promise<string | null>;
  updateTask: (id: string, task: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  
  // Documents
  documents: Document[];
  loadingDocuments: boolean;
  createDocument: (document: Omit<Document, 'id' | 'created_at'>) => Promise<string | null>;
  deleteDocument: (id: string) => Promise<boolean>;
  
  // Valuations
  valuations: Valuation[];
  loadingValuations: boolean;
  createValuation: (valuation: Omit<Valuation, 'id' | 'created_at' | 'created_by'>) => Promise<string | null>;
  updateValuation: (id: string, valuation: Partial<Valuation>) => Promise<boolean>;
  deleteValuation: (id: string) => Promise<boolean>;
  
  // Data loading
  refreshData: (dataTypes?: ('properties' | 'deals' | 'tasks' | 'documents' | 'valuations')[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // State for different data types
  const [properties, setProperties] = useState<Property[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [valuations, setValuations] = useState<Valuation[]>([]);
  
  // Loading states
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [loadingValuations, setLoadingValuations] = useState(false);
  
  // Load data when user changes
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);
  
  // Fetch all data
  const refreshData = async (
    dataTypes: ('properties' | 'deals' | 'tasks' | 'documents' | 'valuations')[] = [
      'properties', 'deals', 'tasks', 'documents', 'valuations'
    ]
  ) => {
    if (!user) return;
    
    if (dataTypes.includes('properties')) {
      await fetchProperties();
    }
    
    if (dataTypes.includes('deals')) {
      await fetchDeals();
    }
    
    if (dataTypes.includes('tasks')) {
      await fetchTasks();
    }
    
    if (dataTypes.includes('documents')) {
      await fetchDocuments();
    }
    
    if (dataTypes.includes('valuations')) {
      await fetchValuations();
    }
  };
  
  // Properties CRUD
  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProperties(data as Property[]);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoadingProperties(false);
    }
  };
  
  const createProperty = async (property: Omit<Property, 'id' | 'created_at' | 'created_by'>): Promise<string | null> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const newProperty = {
        ...property,
        created_by: user.id
      };
      
      const { data, error } = await supabase
        .from('properties')
        .insert([newProperty])
        .select('id')
        .single();
        
      if (error) throw error;
      
      await fetchProperties();
      toast.success('Property created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to create property');
      return null;
    }
  };
  
  const updateProperty = async (id: string, property: Partial<Property>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('properties')
        .update(property)
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchProperties();
      toast.success('Property updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
      return false;
    }
  };
  
  const deleteProperty = async (id: string): Promise<boolean> => {
    try {
      // Delete related records first
      await supabase.from('valuations').delete().eq('property_id', id);
      await supabase.from('deals').delete().eq('property_id', id);
      
      // Now delete the property
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchProperties();
      toast.success('Property deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
      return false;
    }
  };
  
  const getPropertyById = async (id: string): Promise<Property | null> => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Property;
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  };
  
  // Deals CRUD
  const fetchDeals = async () => {
    try {
      setLoadingDeals(true);
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setDeals(data as Deal[]);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoadingDeals(false);
    }
  };
  
  const createDeal = async (deal: Omit<Deal, 'id' | 'created_at' | 'created_by'>): Promise<string | null> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const newDeal = {
        ...deal,
        created_by: user.id
      };
      
      const { data, error } = await supabase
        .from('deals')
        .insert([newDeal])
        .select('id')
        .single();
        
      if (error) throw error;
      
      await fetchDeals();
      toast.success('Deal created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error('Failed to create deal');
      return null;
    }
  };
  
  const updateDeal = async (id: string, deal: Partial<Deal>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deals')
        .update(deal)
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchDeals();
      toast.success('Deal updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error('Failed to update deal');
      return false;
    }
  };
  
  const deleteDeal = async (id: string): Promise<boolean> => {
    try {
      // Delete related records first
      await supabase.from('tasks').delete().eq('deal_id', id);
      await supabase.from('documents').delete().eq('deal_id', id);
      
      // Now delete the deal
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchDeals();
      toast.success('Deal deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
      return false;
    }
  };
  
  const getDealById = async (id: string): Promise<Deal | null> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Deal;
    } catch (error) {
      console.error('Error fetching deal:', error);
      return null;
    }
  };
  
  // Tasks CRUD
  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });
        
      if (error) throw error;
      setTasks(data as Task[]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  };
  
  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'created_by'>): Promise<string | null> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const newTask = {
        ...task,
        created_by: user.id
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select('id')
        .single();
        
      if (error) throw error;
      
      await fetchTasks();
      toast.success('Task created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      return null;
    }
  };
  
  const updateTask = async (id: string, task: Partial<Task>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchTasks();
      toast.success('Task updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return false;
    }
  };
  
  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchTasks();
      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  };
  
  // Documents CRUD
  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setDocuments(data as Document[]);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoadingDocuments(false);
    }
  };
  
  const createDocument = async (document: Omit<Document, 'id' | 'created_at'>): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([document])
        .select('id')
        .single();
        
      if (error) throw error;
      
      await fetchDocuments();
      toast.success('Document created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
      return null;
    }
  };
  
  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchDocuments();
      toast.success('Document deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      return false;
    }
  };
  
  // Valuations CRUD
  const fetchValuations = async () => {
    try {
      setLoadingValuations(true);
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setValuations(data as Valuation[]);
    } catch (error) {
      console.error('Error fetching valuations:', error);
      toast.error('Failed to load valuations');
    } finally {
      setLoadingValuations(false);
    }
  };
  
  const createValuation = async (valuation: Omit<Valuation, 'id' | 'created_at' | 'created_by'>): Promise<string | null> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const newValuation = {
        ...valuation,
        created_by: user.id
      };
      
      const { data, error } = await supabase
        .from('valuations')
        .insert([newValuation])
        .select('id')
        .single();
        
      if (error) throw error;
      
      await fetchValuations();
      toast.success('Valuation created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating valuation:', error);
      toast.error('Failed to create valuation');
      return null;
    }
  };
  
  const updateValuation = async (id: string, valuation: Partial<Valuation>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('valuations')
        .update(valuation)
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchValuations();
      toast.success('Valuation updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating valuation:', error);
      toast.error('Failed to update valuation');
      return false;
    }
  };
  
  const deleteValuation = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('valuations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      await fetchValuations();
      toast.success('Valuation deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting valuation:', error);
      toast.error('Failed to delete valuation');
      return false;
    }
  };

  const value = {
    // Properties
    properties,
    loadingProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    
    // Deals
    deals,
    loadingDeals,
    createDeal,
    updateDeal,
    deleteDeal,
    getDealById,
    
    // Tasks
    tasks,
    loadingTasks,
    createTask,
    updateTask,
    deleteTask,
    
    // Documents
    documents,
    loadingDocuments,
    createDocument,
    deleteDocument,
    
    // Valuations
    valuations,
    loadingValuations,
    createValuation,
    updateValuation,
    deleteValuation,
    
    // Refresh data
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
