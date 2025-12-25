
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sjcauuaiezegysftakrd.supabase.co';
const supabaseKey = 'sb_publishable_ygPGcmKfg5XeRdhC8_Mvgw_46NxDNWK';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Helper to sync a single employee to Supabase.
 * Assumes a table 'employees' exists with an 'id' primary key.
 */
export const syncEmployeeToSupabase = async (employee: any) => {
  const { error } = await supabase
    .from('employees')
    .upsert({ id: employee.id, data: employee }, { onConflict: 'id' });
  if (error) console.error('Error syncing employee:', error);
};

/**
 * Helper to sync system config to Supabase.
 * Assumes a table 'config' exists with a single row.
 */
export const syncConfigToSupabase = async (config: any) => {
  const { error } = await supabase
    .from('config')
    .upsert({ id: 'main_config', data: config }, { onConflict: 'id' });
  if (error) console.error('Error syncing config:', error);
};
