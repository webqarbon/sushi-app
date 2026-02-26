
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.trim().match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function debug() {
  const orderIdPrefix = 'dd94b75a';
  
  console.log(`Fetching last 50 orders...`);
  const { data: orders, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (orderError) {
    console.error('Error fetching orders:', orderError);
    return;
  }

  const order = orders.find(o => o.id.startsWith(orderIdPrefix));
  console.log('Order Data:', JSON.stringify(order, null, 2));

  if (order.user_id) {
    console.log(`Fetching user profile for user_id: ${order.user_id}...`);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', order.user_id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    } else {
      console.log('Profile Data:', JSON.stringify(profile, null, 2));
    }
  } else {
    console.log('Warning: Order has NO user_id associated!');
  }
}

debug();
