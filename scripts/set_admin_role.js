require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

// ⬇️ ВКАЖІТЬ EMAIL АДМІНІСТРАТОРІВ
const ADMIN_EMAILS = [
  'death@gmail.com',
  'frozen_admin_2026@frozen-market.ua',
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setAdminRole() {
  console.log('🔑 Встановлення ролі адміна...\n');

  for (const email of ADMIN_EMAILS) {
    // Знайти юзера за email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Помилка отримання списку юзерів:', listError.message);
      return;
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log(`⚠️  Юзера з email "${email}" не знайдено — пропускаємо`);
      continue;
    }

    // Оновити метадані
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, role: 'admin' },
    });

    if (updateError) {
      console.error(`❌ Помилка для ${email}:`, updateError.message);
    } else {
      console.log(`✅ ${email} → role: "admin" встановлено`);
    }
  }

  console.log('\n✨ Готово! Перелогіньтесь на сайті.');
}

setAdminRole();
