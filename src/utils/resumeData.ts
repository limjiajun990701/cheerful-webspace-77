
import { supabase } from '@/integrations/supabase/client';
import { Resume } from '@/types/database';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_BUCKET = 'resumes';
const DEFAULT_RESUME: Resume & { fileUrl: string; fileName: string } = {
  id: 'default',
  user_id: '00000000-0000-0000-0000-000000000000', // Using a valid UUID format
  file_name: 'resume.pdf',
  file_path: '/resume-sample.pdf',
  file_size: 0,
  upload_date: new Date().toISOString(),
  fileUrl: '/resume-sample.pdf', // Default placeholder
  fileName: 'resume.pdf',
};

// Get the current resume
export const getCurrentResume = async (): Promise<(Resume & { fileUrl: string; fileName: string }) | null> => {
  try {
    // Query the resumes table for the most recent resume
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('upload_date', { ascending: false })
      .limit(1)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no data is found

    if (error) {
      console.error("Error fetching resume:", error);
      return DEFAULT_RESUME;
    }

    if (!data) {
      console.log("No resume found");
      return DEFAULT_RESUME;
    }

    // Get the public URL for the file
    const { data: publicUrlData } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.file_path);

    // Return the resume with fileUrl for compatibility
    return {
      ...data,
      fileUrl: publicUrlData.publicUrl,
      fileName: data.file_name
    };
  } catch (error) {
    console.error("Error in getCurrentResume:", error);
    return DEFAULT_RESUME;
  }
};

// Upload a new resume
export const uploadResume = async (file: File): Promise<Resume & { fileUrl: string; fileName: string }> => {
  try {
    // Generate a unique ID for the resume
    const resumeId = uuidv4();
    const fileExt = file.name.split('.').pop();
    const filePath = `${resumeId}.${fileExt}`;
    
    // Upload the file to storage
    const { error: storageError } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (storageError) {
      console.error("Storage error:", storageError);
      throw storageError;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    // Generate a valid UUID for user_id
    const userId = uuidv4();
    
    // Define the resume data for database insertion
    const resumeData = {
      user_id: userId, // Use a valid UUID
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      upload_date: new Date().toISOString()
    };
    
    // Insert new resume - explicitly listing columns to avoid any issues
    const { data, error } = await supabase
      .from('resumes')
      .insert([{
        user_id: resumeData.user_id,
        file_name: resumeData.file_name,
        file_path: resumeData.file_path,
        file_size: resumeData.file_size,
        upload_date: resumeData.upload_date
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Insert error:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from insert");
    }
    
    return {
      ...data,
      fileUrl: publicUrlData.publicUrl,
      fileName: file.name
    };
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw error;
  }
};

// Delete resume
export const deleteResume = async (): Promise<void> => {
  try {
    // Get the most recent resume record first
    const { data, error: fetchError } = await supabase
      .from('resumes')
      .select('id, file_path')
      .order('upload_date', { ascending: false })
      .limit(1)
      .maybeSingle(); // Use maybeSingle instead of single

    if (fetchError) {
      throw fetchError;
    }

    if (data) {
      // Delete the file from storage
      const { error: storageError } = await supabase
        .storage
        .from(STORAGE_BUCKET)
        .remove([data.file_path]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }

      // Delete the resume record
      const { error: deleteError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', data.id);

      if (deleteError) {
        throw deleteError;
      }
    }
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
};
