
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

async function fixBonuses() {
  const userId = '94e21b98-fd0d-4931-899c-1bcfdb8fe88e';
  const earnedBonuses = 21.5; // 215 * 10%
  
  console.log(`Fixing bonuses for user ${userId}...`);
  
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('bonus_balance')
    .eq('id', userId)
    .single();

  if (fetchError) {
    console.error('Error fetching profile:', fetchError);
    return;
  }

  const newBalance = Number(profile.bonus_balance) + earnedBonuses;
  
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ bonus_balance: newBalance })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating balance:', updateError);
  } else {
    console.log(`Success! New balance for user ${userId} is ${newBalance}`);
  }
}

fixBonuses();
