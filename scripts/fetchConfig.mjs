import { supabase } from '../supabase.js';

async function main() {
  const { data, error } = await supabase.from('config').select('data').eq('id','main_config').single();
  if (error) {
    console.error('Error fetching config:', error);
    process.exit(1);
  }
  console.log('Fetched config:', JSON.stringify(data, null, 2));
}

main();
