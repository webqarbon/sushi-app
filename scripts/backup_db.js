const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function backup() {
    console.log('Starting backup...');
    const tables = ['categories', 'products', 'profiles', 'orders', 'reviews'];
    const backupData = {};

    for (const table of tables) {
        console.log(`Fetching data from ${table}...`);
        const { data, error } = await supabase.from(table).select('*');
        if (error) {
            console.error(`Error fetching ${table}:`, error);
            backupData[table] = [];
        } else {
            backupData[table] = data;
            console.log(`Fetched ${data.length} records from ${table}.`);
        }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `db_backup_${timestamp}.json`;
    fs.writeFileSync(filename, JSON.stringify(backupData, null, 2));
    console.log(`Backup saved to ${filename}`);
}

backup();
