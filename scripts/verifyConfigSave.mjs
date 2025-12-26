import { createClient } from '@supabase/supabase-js';

(async function run() {
  try {
    const supabaseUrl = 'https://sjcauuaiezegysftakrd.supabase.co';
    const supabaseKey = 'sb_publishable_ygPGcmKfg5XeRdhC8_Mvgw_46NxDNWK';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const testCompany = `PERFORMX_VERIFY_${Date.now()}`;
    const payload = {
      id: 'main_config',
      data: {
        companyName: testCompany,
        companyLogo: null,
        departments: ['Engineering','Design'],
        dashboardWidgets: { charts: true }
      }
    };

    console.log('Upserting test config:', payload.data.companyName);
    const { data: upsertData, error: upErr } = await supabase.from('config').upsert(payload, { onConflict: 'id' });
    if (upErr) {
      console.error('Upsert error:', upErr);
      process.exit(2);
    }

    console.log('Upsert succeeded, verifying read...');
    const { data: fetched, error: fetchErr } = await supabase.from('config').select('data').eq('id', 'main_config').single();
    if (fetchErr) {
      console.error('Fetch error:', fetchErr);
      process.exit(3);
    }

    console.log('Fetched config:', JSON.stringify(fetched.data, null, 2));

    if (fetched.data.companyName === testCompany) {
      console.log('Persistence verified ✅');
      process.exit(0);
    } else {
      console.error('Mismatch: saved value not matching fetched value');
      process.exit(4);
    }
  } catch (err) {
    console.error('Unexpected error', err);
    process.exit(1);
  }
})();