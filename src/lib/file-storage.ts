
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export type FileType = 'documents' | 'profiles' | 'properties';

/**
 * Upload a file to Supabase storage
 */
export const uploadFile = async (
  file: File,
  filePath: string,
  fileType: FileType = 'documents'
): Promise<{
  path: string;
  url: string;
} | null> => {
  try {
    if (!file) return null;
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const fullPath = `${filePath}/${fileName}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(fileType)
      .upload(fullPath, file);
      
    if (error) throw error;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(fileType)
      .getPublicUrl(data.path);
      
    return {
      path: data.path,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    return null;
  }
};

/**
 * Delete a file from Supabase storage
 */
export const deleteFile = async (
  filePath: string,
  fileType: FileType = 'documents'
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(fileType)
      .remove([filePath]);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    toast.error('Failed to delete file');
    return false;
  }
};
