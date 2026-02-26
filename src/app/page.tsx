import HomeContent from "@/components/HomeContent";
import { createClient } from "@/utils/supabase/server";
import { Category, Product } from "@/types/database";

export default async function Home() {
  const supabase = await createClient();

  // Fetch Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("order_index", { ascending: true });

  // Fetch Products
  const { data: products } = await supabase
    .from("products")
    .select("*");

  return (
    <HomeContent 
      categories={categories as Category[] || []} 
      products={products as Product[] || []} 
    />
  );
}
