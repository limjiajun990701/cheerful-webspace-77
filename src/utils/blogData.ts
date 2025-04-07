
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  excerpt: string;
  imageUrl?: string;
}

// Get all blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    // Map database column names to our interface properties
    return (data || []).map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      date: post.date,
      tags: post.tags,
      excerpt: post.excerpt || '',
      imageUrl: post.imageurl
    }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

// Get a single blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      date: data.date,
      tags: data.tags,
      excerpt: data.excerpt || '',
      imageUrl: data.imageurl
    };
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return null;
  }
};

// Add a new blog post
export const addBlogPost = async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title: post.title,
        content: post.content,
        date: post.date,
        tags: post.tags,
        excerpt: post.excerpt,
        imageurl: post.imageUrl
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      date: data.date,
      tags: data.tags,
      excerpt: data.excerpt || '',
      imageUrl: data.imageurl
    };
  } catch (error) {
    console.error("Error adding blog post:", error);
    throw error;
  }
};

// Update an existing blog post
export const updateBlogPost = async (post: BlogPost): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: post.title,
        content: post.content,
        date: post.date,
        tags: post.tags,
        excerpt: post.excerpt,
        imageurl: post.imageUrl
      })
      .eq('id', post.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      date: data.date,
      tags: data.tags,
      excerpt: data.excerpt || '',
      imageUrl: data.imageurl
    };
  } catch (error) {
    console.error(`Error updating blog post with ID ${post.id}:`, error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw error;
  }
};
