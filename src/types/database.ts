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
  image_url: string;
  bonus_percent: number;
  fake_rating: number;
  fake_reviews_count: number;
};
