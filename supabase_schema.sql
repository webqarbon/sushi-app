-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  bonus_balance NUMERIC DEFAULT 0
);

-- Turn on RLS for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can see and update their own profiles
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Create Categories Table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Categories are public
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);

-- 3. Create Products Table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  bonus_percent NUMERIC DEFAULT 5.0,
  fake_rating NUMERIC DEFAULT 4.8,
  fake_reviews_count INTEGER DEFAULT 120
);

-- Products are public
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON products FOR SELECT USING (true);

-- 4. Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  items_json JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  bonuses_used NUMERIC DEFAULT 0,
  payment_status TEXT CHECK (payment_status IN ('pending', 'awaiting_check', 'paid')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('mono', 'details')) NOT NULL,
  delivery_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users view own orders" 
ON orders FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can create orders" 
ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only service role / webhook can update orders (e.g., status) securely. 
-- We won't allow simple users to UPDATE orders, protecting payment statuses from being tampered with.
