const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role to bypass email confirmation
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = 'frozen_admin_2026@frozen-market.ua';
const ADMIN_PASSWORD = 'FrozenMaster_99_Safe!';

async function createAdminUser() {
    console.log(`Attempting to create admin user: ${ADMIN_EMAIL}`);

    // Create user via Admin API
    const { data, error } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { 
            role: 'admin',
            full_name: 'System Administrator'
        }
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('Admin user already exists. Updating metadata...');
            // If exists, find user id and update metadata
            const { data: users } = await supabase.auth.admin.listUsers();
            const user = users.users.find(u => u.email === ADMIN_EMAIL);
            if (user) {
                await supabase.auth.admin.updateUserById(user.id, {
                    user_metadata: { role: 'admin' }
                });
                console.log('Metadata updated to admin role.');
            }
        } else {
            console.error('Error creating admin:', error.message);
        }
    } else {
        console.log('Admin user created successfully!');
    }
}

createAdminUser();
