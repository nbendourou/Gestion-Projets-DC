import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vswesgyrtpptpewwogvj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzd2VzZ3lydHBwdHBld3dvZ3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwOTEzODIsImV4cCI6MjA3NzY2NzM4Mn0.e8UJwOUcYij4UUDVvcG0Fm6x4e7TzjVNRgSEekrUWZ4';

// The Supabase client will automatically map snake_case column names in the DB
// to camelCase properties in the returned objects.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
