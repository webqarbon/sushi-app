
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

async function simulatePayment() {
  console.log('--- Simulating Monobank Payment ---');
  
  // 1. Find the latest pending order
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id')
    .eq('payment_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !orders || orders.length === 0) {
    console.error('No pending orders found to simulate payment for.');
    return;
  }

  const orderId = orders[0].id;
  console.log(`Found pending order: ${orderId}`);

  // 2. Send mock webhook request to local server
  try {
    const res = await fetch("http://localhost:3000/api/webhooks/mono", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "success",
        reference: orderId,
        amount: 1000, // example amount in kopecks
        ccy: 980
      }),
    });

    const data = await res.json();
    console.log('Server response:', data);
    
    if (res.ok) {
      console.log('SUCCESS: Payment simulated. Now check your database or UI!');
    } else {
      console.error('FAIL: Server returned an error.');
    }
  } catch (e) {
    console.error('Request failed. Is your dev server running at http://localhost:3000 ?', e.message);
  }
}

simulatePayment();
