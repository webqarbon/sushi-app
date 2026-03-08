export interface Category {
  id: string;
  name: string;
  slug: string;
  order_index: number;
  image_url?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost_price: number;
  bonus_percent: number;
  image_url?: string;
  category_id: string;
  average_rating?: number;
  reviews_count?: number;
  categories?: { name: string };
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  email?: string;
  bonus_balance?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  status: 'pending' | 'confirmed' | 'cooking' | 'delivery' | 'delivered' | 'cancelled';
  total_price: number;
  items_json: { product: Product; quantity: number }[];
  address?: string;
  payment_method?: string;
  comment?: string;
  created_at: string;
  profiles?: { full_name?: string; phone?: string } | null;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  products?: { name: string };
  profiles?: { full_name?: string };
}
