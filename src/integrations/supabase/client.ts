// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dxqrfsdhyqvjekbukjto.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cXJmc2RoeXF2amVrYnVranRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzgwOTksImV4cCI6MjA1OTYxNDA5OX0.HVkY-Xp8j1roNRdJuie5e0FPL5pzhVfS7GcG77vODog";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);