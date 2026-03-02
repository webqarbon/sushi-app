export type Category = {
  id: string;
  name: string;
  slug: string;
  order_index: number;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  cost_price: number;
  image_url: string;
  bonus_percent: number;
  average_rating: number;
  reviews_count: number;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  products?: {
    name: string;
  };
};

export type Order = {
  id: string;
  user_id: string | null;
  items_json: any;
  total_price: number;
  bonuses_used: number;
  payment_status: 'pending' | 'awaiting_check' | 'paid';
  payment_method: 'mono' | 'details';
  delivery_data: any;
  created_at: string;
  profiles?: {
    full_name: string;
    email?: string;
  };
};
