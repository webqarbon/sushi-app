const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = process.env.ADMIN_USER_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_USER_PASSWORD;

async function createAdminUser() {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('ADMIN_USER_EMAIL or ADMIN_USER_PASSWORD not found in env');
        return;
    }

    console.log(`Checking admin user: ${ADMIN_EMAIL}`);

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('Error listing users:', listError.message);
        return;
    }

    const existingUser = users.find(u => u.email === ADMIN_EMAIL);

    if (existingUser) {
        console.log('Admin user exists. Updating...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
            password: ADMIN_PASSWORD,
            user_metadata: { role: 'admin', full_name: 'Frozen Master' }
        });
        if (updateError) console.error('Error updating:', updateError.message);
        else console.log('Admin user updated successfully.');
    } else {
        console.log('Creating new admin user...');
        const { error: createError } = await supabase.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
            user_metadata: { role: 'admin', full_name: 'Frozen Master' }
        });
        if (createError) console.error('Error creating:', createError.message);
        else console.log('Admin user created successfully.');
    }
}

createAdminUser();
