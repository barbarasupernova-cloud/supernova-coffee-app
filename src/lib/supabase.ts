import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owpeosbyhcugwikjbahn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93cGVvc2J5aGN1Z3dpa2piYWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMzAxNTcsImV4cCI6MjA5MDkwNjE1N30.9dNuhQXvNZDT-u_PRl5CEXBoB99FtteUR7K2vK4MWKo';

export const supabase = createClient(supabaseUrl, supabaseKey);

