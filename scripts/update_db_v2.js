const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDatabase() {
  console.log('Running database updates...');

  // Create reviews table SQL string
  const createTableSQL = `
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
        CREATE TABLE reviews (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          product_id UUID REFERENCES products(id) ON DELETE CASCADE,
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Reviews are public viewable if approved" ON reviews;
        CREATE POLICY "Reviews are public viewable if approved" ON reviews FOR SELECT USING (status = 'approved');
        DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;
        CREATE POLICY "Users can insert their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
      END IF;
    END $$;
  `;

  const { error: sqlError } = await supabase.rpc('admin_run_query', { query: createTableSQL });
  // Note: 'admin_run_query' might not exist. Falling back to direct check if possible OR just trying to create storage.
  
  if (sqlError) console.log('SQL update skipped (likely missing RPC). Please run the SQL in dashboard if needed.');

  // Ensure storage bucket for product images exists
  console.log('Checking storage bucket...');
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === 'product-images')) {
      const { data, error } = await supabase.storage.createBucket('product-images', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 5 // 5MB
      });
      if (error) console.error('Error creating bucket:', error.message);
      else console.log('Bucket "product-images" created successfully.');
  } else {
      console.log('Bucket "product-images" already exists.');
  }

  console.log('Update finished.');
}

updateDatabase();
