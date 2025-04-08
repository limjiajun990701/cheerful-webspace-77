
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Interface matching our front-end naming conventions (camelCase)
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  fileUrl: string;
  fileType: 'image' | 'pdf';
  description: string;
  date: string;
  credentialUrl?: string;
}

// Upload certification file to storage
export const uploadCertificationFile = async (file: File): Promise<{ url: string, fileType: 'image' | 'pdf' }> => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const filePath = `certifications/${uuidv4()}.${fileExt}`;
  const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
  
  try {
    // For now, simulate file upload and return a URL
    // In a real app, this would upload to Supabase storage
    
    // Create a blob URL for local preview
    const blobUrl = URL.createObjectURL(file);
    
    // Return the URL and file type
    return {
      url: blobUrl,
      fileType
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Get all certifications
export const getAllCertifications = async (): Promise<Certification[]> => {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    // Map the data from DB format to our interface format
    return (data || []).map(cert => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      fileUrl: cert.fileurl,
      fileType: cert.filetype as 'image' | 'pdf',
      description: cert.description || '',
      date: cert.date,
      credentialUrl: cert.credentialurl
    }));
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
};

// Get a single certification by ID
export const getCertificationById = async (id: string): Promise<Certification | null> => {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      issuer: data.issuer,
      fileUrl: data.fileurl,
      fileType: data.filetype as 'image' | 'pdf',
      description: data.description || '',
      date: data.date,
      credentialUrl: data.credentialurl
    };
  } catch (error) {
    console.error(`Error fetching certification with ID ${id}:`, error);
    return null;
  }
};

// Add a new certification
export const addCertification = async (certification: Omit<Certification, 'id'>): Promise<Certification> => {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .insert([{
        name: certification.name,
        issuer: certification.issuer,
        fileurl: certification.fileUrl,
        filetype: certification.fileType,
        description: certification.description,
        date: certification.date,
        credentialurl: certification.credentialUrl || null
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from insert");
    }

    return {
      id: data.id,
      name: data.name,
      issuer: data.issuer,
      fileUrl: data.fileurl,
      fileType: data.filetype as 'image' | 'pdf',
      description: data.description || '',
      date: data.date,
      credentialUrl: data.credentialurl
    };
  } catch (error) {
    console.error("Error adding certification:", error);
    throw error;
  }
};

// Update an existing certification
export const updateCertification = async (certification: Certification): Promise<Certification> => {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .update({
        name: certification.name,
        issuer: certification.issuer,
        fileurl: certification.fileUrl,
        filetype: certification.fileType,
        description: certification.description,
        date: certification.date,
        credentialurl: certification.credentialUrl || null
      })
      .eq('id', certification.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from update");
    }

    return {
      id: data.id,
      name: data.name,
      issuer: data.issuer,
      fileUrl: data.fileurl,
      fileType: data.filetype as 'image' | 'pdf',
      description: data.description || '',
      date: data.date,
      credentialUrl: data.credentialurl
    };
  } catch (error) {
    console.error(`Error updating certification with ID ${certification.id}:`, error);
    throw error;
  }
};

// Delete a certification
export const deleteCertification = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting certification with ID ${id}:`, error);
    throw error;
  }
};
